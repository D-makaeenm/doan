USE [doan3an1]
GO
/****** Object:  StoredProcedure [dbo].[ql_don]    Script Date: 28/11/2023 1:34:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[ql_don]
	@action nvarchar(50) = 'list_don_hang',
	@madon int = null,
	@makh nvarchar(255) = null,
	@tenkh nvarchar(255) = null,
	@ngaydat datetime = null,
	@tongtien int = null,
	@tenbanh nvarchar(255) = null,
	@giaban int = null,
	@machitiet nvarchar(255) = null,
	@tk nvarchar(50) = null,
	@mk nvarchar(50) = null,
	@mabanh nvarchar(10) = null,
	@size nvarchar(10) = null,
	@sl int = null,
	@congthuc nvarchar(max) = null,
	@diachi nvarchar(255) = null,
	@sdt nvarchar(255) = null,
	@thang int = null,
	@ngayvao date = null,
	@delat date = null,
	@doneat date = null,
	@ngayra date = null,

	@tienthu int = null,
	@tienchi int = null,
	@doanhthu int = null,

	@madonnhap int = null,
	@ngaynhap datetime = null,
	@mancc nvarchar(255) = null,
	@tenncc nvarchar(255) = null,
	@sdtncc nvarchar(255) = null,
	@sln int = null,
	@tongtienhap int = null,

	@noidung nvarchar(max) = null
as
begin
	declare @json nvarchar(max)='';
	if(@action = 'list_don_hang')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":%d,"ngaydat":"%s","tenkh":"%s","tenbanh":"%s",
				"size":"%s","giaban":%d,"sl":%d,"tongtien":%d},',
				dh.[Mã đơn],dh.[Mã khách hàng], CONVERT(nvarchar, dh.[Ngày đặt], 23), dh.[Tên khách hàng],
				b.[Tên bánh],b.[Size],b.[Giá bán], sl.[Số lượng], dh.[Tổng tiền])
		FROM donhang dh
		inner join khachhang kh on dh.[Tên khách hàng] = kh.[Tên khách hàng]
		inner join slban sl on sl.[Mã đơn] = dh.[Mã đơn]
		inner join banh b on sl.[Mã bánh] = b.[Mã bánh]
		where del_at is null and done_at is null
		order by dh.[Mã đơn]

		if((@json is null)or(@json=''))
		select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
	---------------------
	else if(@action = 'list_don_nhap')
	begin
		select @json+=FORMATMESSAGE(N'{"madonnhap":%d,"ngaynhap":"%s","mancc":"%s","tenncc":"%s","sdtncc":"%s","tenbanh":"%s",
				"sln":%d,"tongtiennhap":%d,"size":"%s"},',
				nb.[Mã đơn nhập], CONVERT(nvarchar, nb.[Ngày nhập], 23), nb.[Mã xưởng], nb.[Tên xưởng],
				nb.[Số điện thoại],ctn.[Tên bánh], ctn.[Số lượng], ctn.[Tổng tiền], ctn.Size)
		FROM nhapbanh nb
		inner join chitietnhap ctn on ctn.[Mã đơn nhập] = nb.[Mã đơn nhập]
		where nb.del_at is null and nb.done_at is null
		order by nb.[Mã đơn nhập]

		if((@json is null)or(@json=''))
		select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end


	else if(@action = 'them_don_nhap')
	begin
		insert into nhapbanh ([Ngày nhập],[Mã xưởng],[Tên xưởng],[Số điện thoại]) values (@ngaynhap,@mancc,@tenncc,@sdtncc)
		insert into chitietnhap ([Ngày nhập], [Tên bánh], [Số lượng], Size) values (@ngaynhap,@tenbanh,@sln,@size)
		insert into kho	([Tên bánh], Size, [Số lượng]) values (@tenbanh, @size, @sln)

		update chitietnhap
		set [Mã bánh] = b.[Mã bánh]
		from chitietnhap ctn
		inner join banh b on b.[Tên bánh] = ctn.[Tên bánh] and b.Size = ctn.Size

		update chitietnhap
		set [Mã đơn nhập] = nb.[Mã đơn nhập]
		from chitietnhap ctn
		inner join nhapbanh nb on ctn.[Ngày nhập] = nb.[Ngày nhập]

		update chitietnhap
		set [Tổng tiền] = b.[Giá nhập] * ctn.[Số lượng]
		from chitietnhap ctn
		inner join banh b on b.[Mã bánh] = ctn.[Mã bánh]
		inner join nhapbanh nb on nb.[Mã đơn nhập] = ctn.[Mã đơn nhập]

		update kho
		set [Mã bánh] = ctn.[Mã bánh]
		from kho k 
		inner join chitietnhap ctn on k.[Tên bánh] = ctn.[Tên bánh] and k.Size = ctn.Size

		CREATE TABLE #TempKho
		(
			[Mã bánh] nchar(10) NULL,
			[Tên bánh] nvarchar(50) NULL,
			Size nchar(10) NULL,
			[Tổng Số lượng] int NULL
		);
		INSERT INTO #TempKho ([Mã bánh], [Tên bánh], Size, [Tổng Số lượng])
			SELECT
				[Mã bánh],
				[Tên bánh],
				Size,
				SUM([Số lượng]) AS [Tổng Số lượng]
			FROM kho
			GROUP BY [Mã bánh], [Tên bánh], Size;

			-- Xóa toàn bộ dữ liệu trong bảng gốc
			DELETE FROM kho;

			-- Chèn lại dữ liệu từ bảng tạm vào bảng gốc
			INSERT INTO kho ([Mã bánh], [Tên bánh], Size, [Số lượng])
			SELECT [Mã bánh], [Tên bánh], Size, [Tổng Số lượng]
			FROM #TempKho;
			DROP TABLE #TempKho;
		
		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã thêm thành công đơn hàng "}');
		select @json as json;
	end

	else if (@action = 'xoa_don_nhap')
	begin
		update nhapbanh
		set del_at = getdate()
		from nhapbanh
		where [Mã đơn nhập] = @madonnhap
		select @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã xóa thành công công ty"}')
		select @json as json;
	end

	else if(@action = 'don_nhap_da_xoa')
	begin
		select @json+=FORMATMESSAGE(N'{"madonnhap":%d,"mancc":"%s","tenncc":"%s","delat":"%s"},',
				[Mã đơn nhập],[Mã xưởng],[Tên xưởng], CONVERT(nvarchar, del_at, 23))
		FROM nhapbanh
		where del_at is not null

		if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
	--else if (@action ='sua_don_nhap')
	--begin
		
	--end

	else if(@action = 'don_nhap_da_done')
	begin
		select @json+=FORMATMESSAGE(N'{"madonnhap":%d,"mancc":"%s","tenncc":"%s","ngaynhap":"%s","tongtiennhap":%d,"doneat":"%s"},',
				nb.[Mã đơn nhập],[Mã xưởng],[Tên xưởng],convert(nvarchar, nb.[Ngày nhập], 23),ctn.[Tổng tiền], CONVERT(nvarchar, done_at, 23))
		FROM nhapbanh nb
		inner join chitietnhap ctn on nb.[Mã đơn nhập] = ctn.[Mã đơn nhập]
		where done_at is not null

		if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end

	else if (@action = 'done_don_nhap')
	begin
		update nhapbanh
		set done_at = getdate() where [Mã đơn nhập] = @madonnhap;
		select @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã xóa thành công công ty"}')
		select @json as json;
	end


	---------------------
	else if(@action = 'them_don_hang')
	begin

		IF NOT EXISTS (SELECT 1 FROM khachhang WHERE [Tên khách hàng] = @tenkh)
		BEGIN
			-- Nếu khách hàng chưa tồn tại, thêm mới vào bảng khachhang
			insert into khachhang ([Tên khách hàng], [Địa chỉ], SDT) values (@tenkh, @diachi, @sdt);
		END
		insert into donhang ([Tên khách hàng],[Ngày đặt]) values (@tenkh,@ngaydat);
		insert into slban ([Tên khách hàng],[Số lượng],[Ngày đặt],[Tên bánh],Size) values (@tenkh,@sl,@ngaydat,@tenbanh,@size);
		insert into khoban ([Số lượng],[Tên bánh],Size,[Ngày đặt]) values (@sl,@tenbanh,@size,@ngaydat);
		--insert into doanhthu ([Tên khách hàng],[Ngày đặt]) values (@tenkh,@ngaydat);

		update khachhang
		set [Địa chỉ]=@diachi, SDT=@sdt
		from khachhang
		where [Tên khách hàng] = @tenkh

		update donhang
		set [Mã khách hàng] = kh.[Mã khách hàng]
		from donhang dh
		inner join khachhang kh on dh.[Tên khách hàng] = kh.[Tên khách hàng]

		update slban
		set [Mã đơn] = dh.[Mã đơn]
		from slban sl
		inner join donhang dh on sl.[Tên khách hàng] = dh.[Tên khách hàng] and sl.[Ngày đặt] = dh.[Ngày đặt]

		UPDATE slban
		SET [Mã bánh] = b.[Mã bánh]
		FROM slban sl
		INNER JOIN donhang dh ON sl.[Mã đơn] = dh.[Mã đơn]
		inner join banh b on b.[Tên bánh] = sl.[Tên bánh]
		WHERE sl.[Mã đơn] = dh.[Mã đơn] and sl.[Ngày đặt] = dh.[Ngày đặt] and sl.Size = b.Size;

		update donhang
		set [Tổng tiền] = sl.[Số lượng] * b.[Giá bán]
		from donhang dh
		inner join slban sl on dh.[Mã đơn] = sl.[Mã đơn]
		inner join banh b on sl.[Mã bánh] = b.[Mã bánh]

		update khoban
		set [Mã bánh] = sl.[Mã bánh]
		from kho k 
		inner join slban sl on k.[Tên bánh] = sl.[Tên bánh] and k.Size = sl.Size

		declare @bientru int;
		set @bientru = (SELECT TOP 1 [Số lượng]
		FROM khoban
		ORDER BY [Ngày đặt] DESC)

		update kho
		set [Số lượng] = [Số lượng] - @bientru
		--UPDATE doanhthu
		--set [Mã đơn] = dh.[Mã đơn]
		--from doanhthu dt
		--inner join donhang dh on dt.[Tên khách hàng] = dh.[Tên khách hàng] and dt.[Ngày đặt] = dh.[Ngày đặt]

		--update doanhthu
		--set [Tiền thu] = (select SUM([Tổng tiền]) from donhang where [Mã đơn] is not null)
		--from doanhthu


		--- 
		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã thêm thành công đơn hàng "}');
		select @json as json;
	end
	-----------------------
	else if (@action = 'xoa_don_hang')
	begin
		update donhang
		set del_at = getdate() where [Mã đơn] = @madon;
		select @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã xóa thành công công ty"}')
		select @json as json;
	end

	else if(@action = 'don_da_xoa')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":%d,"tenkh":"%s","delat":"%s"},',
				[Mã đơn],[Mã khách hàng],[Tên khách hàng], CONVERT(nvarchar, del_at, 23))

		FROM donhang
		where del_at is not null

		if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
	------------------------------------
	else if(@action = 'don_da_done')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":%d,"tenkh":"%s","tongtien":%d,"doneat":"%s"},',
				[Mã đơn],[Mã khách hàng],[Tên khách hàng],[Tổng tiền] ,CONVERT(nvarchar, done_at, 23))
		FROM donhang
		where done_at is not null

		if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end

	else if (@action = 'done_don_hang')
	begin
		update donhang
		set done_at = getdate() where [Mã đơn] = @madon;
		select @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã xóa thành công công ty"}')
		select @json as json;
	end
	------------------------------------
	else if (@action = 'edit_don_hang')
	begin
		IF NOT EXISTS (SELECT 1 FROM khachhang WHERE [Tên khách hàng] = @tenkh)
		BEGIN
			-- Nếu khách hàng chưa tồn tại, thêm mới vào bảng khachhang
			insert into khachhang ([Tên khách hàng], [Địa chỉ], SDT) values (@tenkh, @diachi, @sdt);
		END
		update donhang
		set [Tên khách hàng] = @tenkh, [Ngày đặt] = @ngaydat
		from donhang
		where [Mã đơn] = @madon

		update khachhang
		set [Tên khách hàng] = @tenkh, [Địa chỉ] = @diachi, SDT = @sdt
		from khachhang kh
		inner join donhang dh on kh.[Tên khách hàng] = dh.[Tên khách hàng]
		where dh.[Mã đơn] = @madon

		update donhang
		set [Mã khách hàng] = kh.[Mã khách hàng]
		from donhang dh
		inner join khachhang kh on dh.[Tên khách hàng] = kh.[Tên khách hàng]
		where dh.[Mã đơn] = @madon

		update slban
		set [Tên bánh] = @tenbanh, Size = @size, [Số lượng] = @sl, [Ngày đặt] = @ngaydat, [Tên khách hàng] = @tenkh
		from slban
		where [Mã đơn] = @madon

		UPDATE slban
		SET [Mã bánh] = b.[Mã bánh]
		FROM slban sl
		inner join banh b on b.[Tên bánh] = sl.[Tên bánh]
		WHERE [Mã đơn] = @madon and sl.[Ngày đặt] = @ngaydat and sl.Size = b.Size;

		update donhang
		set [Tổng tiền] = sl.[Số lượng] * b.[Giá bán]
		from donhang dh
		inner join slban sl on dh.[Mã đơn] = sl.[Mã đơn]
		inner join banh b on sl.[Mã bánh] = b.[Mã bánh]
		where dh.[Mã đơn] = @madon

		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã sửa thành công!"}')
		select @json as json;
	end
	---------------------------
	else if(@action = 'show_kho')
	begin
		select @json+=FORMATMESSAGE(N'{"tenbanh":"%s","size":"%s","sl":%d},',
				[Tên bánh],Size ,[Số lượng])
		FROM kho


		if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end

	--------------------------------------
	else if (@action = 'tinh_tien_thu')
	begin
		select @json += FORMATMESSAGE(N'{"tienthu":%d},', sum([Tổng tiền]))
		from donhang
		where done_at is not null
		and [Ngày đặt] >= @ngayvao AND [Ngày đặt] <= @ngayra

		if((@json is null)or(@json=''))
		select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
	else if (@action = 'tinh_tien_chi')
	begin
		select @json += FORMATMESSAGE(N'{"tienchi":%d},', sum([Tổng tiền]))
		from chitietnhap ctn
		inner join nhapbanh nb on ctn.[Mã đơn nhập] = nb.[Mã đơn nhập]
		where done_at is not null
		and nb.[Ngày nhập] >= @ngayvao AND nb.[Ngày nhập] <= @ngayra

		if((@json is null)or(@json=''))
		select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
	else if (@action = 'tinh_doanh_thu')
	begin
		
		insert into doanhthu([Tiền chi], [Tiền thu], [Doanh thu]) values (@tienchi, @tienthu, @doanhthu);
		update doanhthu
		set [Xem lúc] = getdate()
		from doanhthu

		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã thêm thành công doanh thu "}');
		select @json as json;
	end
	else if (@action = 'nhan_phan_hoi')
	begin
			insert into phanhoi ([Nội dung],[Tên khách hàng],[Tên bánh]) values (@noidung, @tenkh, @tenbanh);

			set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã thêm thành công phản hồi"}');
			select @json as json;
	end
	else if(@action = 'xem_phan_hoi')
	begin

		select @json+=FORMATMESSAGE(N'{"noidung":"%s","tenkh":"%s","tenbanh":"%s"},',[Nội dung],[Tên khách hàng],[Tên bánh])
			FROM phanhoi 

		if((@json is null)or(@json=''))
			select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
			else	
				begin
					select @json=REPLACE(@json,'(null)','null')
					select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
				end
	end
end
