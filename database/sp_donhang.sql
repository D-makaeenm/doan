USE [doan3an1]
GO
/****** Object:  StoredProcedure [dbo].[ql_don]    Script Date: 16/11/2023 4:41:50 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[ql_don]
	@action nvarchar(50) = 'list_don_hang',
	@madon int = null,
	@makh nvarchar(255) = null,
	@tenkh nvarchar(255) = null,
	@ngaydat date = null,
	@tongtien int = null,
	@tenbanh nvarchar(255) = null,
	@giatien int = null,
	@thiethai int = null,
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
	@ngayra date = null
as
begin
	declare @json nvarchar(max)='';
	if(@action = 'list_don_hang')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":"%s","ngaydat":"%s","tenkh":"%s","tenbanh":"%s",
				"size":"%s","giatien":%d,"sl":%d},',
				dh.[Mã đơn],kh.[Mã khách hàng], CONVERT(nvarchar, [Ngày đặt], 23), kh.[Tên khách hàng],
				b.[Tên bánh],b.[Size],b.[Giá tiền], sb.[Số lượng])
		--SELECT dh.[Mã đơn], kh.[Mã khách hàng], kh.[Tên khách hàng], dh.[Ngày đặt],
		--b.[Tên bánh], b.[Size], b.[Giá tiền],
		----sb.[Số lượng] * b.[Giá tiền] AS [Tổng tiền]
		FROM donhang dh
		INNER JOIN khachhang kh ON dh.[Mã đơn] = kh.[Mã đơn]
		INNER JOIN slban sb ON dh.[Mã đơn] = sb.[Mã đơn]
		INNER JOIN banh b ON sb.[Mã chi tiết] = b.[Mã chi tiết]
		where del_at is null
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


	---------------------
	else if(@action = 'them_don_hang')
	begin
		insert into donhang ([Mã khách hàng],[Ngày đặt]) values (@makh,@ngaydat);

		insert into khachhang ([Mã khách hàng],[Tên khách hàng], [Địa chỉ], SDT) values (@makh,@tenkh, @diachi, @sdt);
		update khachhang
		set	[Mã đơn] = d.[Mã đơn]	
		from khachhang kh
		inner join donhang d on kh.[Mã khách hàng] = d.[Mã khách hàng]

		insert into slban ([Mã khách hàng], [Số lượng], [Mã bánh]) values (@makh,@sl,@mabanh)
		update slban
		set [Mã đơn] = d.[Mã đơn]
		from slban sl
		inner join donhang d on sl.[Mã khách hàng] = d.[Mã khách hàng]

		update slban
		set [Mã chi tiết] = b.[Mã chi tiết]
		from slban sl
		inner join banh b on sl.[Mã bánh] = b.[Mã bánh]
		
		UPDATE donhang
		SET [Tổng tiền] = sl.[Số lượng] * b.[Giá tiền]
		from donhang dh
		INNER JOIN slban sl ON dh.[Mã đơn] = sl.[Mã đơn]
		INNER JOIN banh b ON sl.[Mã chi tiết] = b.[Mã chi tiết]
		where del_at is null

		insert into thiethai ([Mã khách hàng]) values (@makh)
		update thiethai
		set [Mã đơn] = d.[Mã đơn], [Thiệt hại] = sl.[Số lượng] * b.[Giá mua]
		from thiethai th
		inner join donhang d on th.[Mã khách hàng] = d.[Mã khách hàng]
		INNER JOIN slban sl ON d.[Mã đơn] = sl.[Mã đơn]
		INNER JOIN banh b ON sl.[Mã chi tiết] = b.[Mã chi tiết]
		where del_at is null
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

	----------------------------------
	else if (@action = 'edit_don_hang')
	begin
		update donhang
		set [Mã khách hàng] = @makh,
		[Ngày đặt] = @ngaydat,
		[Tổng tiền] = sl.[Số lượng] * b.[Giá tiền]
		from donhang dh
		INNER JOIN slban sl ON dh.[Mã đơn] = sl.[Mã đơn]
		INNER JOIN banh b ON sl.[Mã chi tiết] = b.[Mã chi tiết]
		where dh.[Mã đơn] = @madon

		update slban
		set [Mã khách hàng] = d.[Mã khách hàng], [Số lượng] = @sl, [Mã bánh] = @mabanh
		from slban sl
		inner join banh b on sl.[Mã chi tiết] = b.[Mã chi tiết]
		inner join donhang d on sl.[Mã đơn] = d.[Mã đơn]
		where sl.[Mã đơn] = @madon

		update slban
		set [Mã chi tiết] = b.[Mã chi tiết]
		from slban sl
		inner join banh b on sl.[Mã bánh] = b.[Mã bánh]

		update khachhang
		set [Mã khách hàng] = d.[Mã khách hàng], [Tên khách hàng] = @tenkh, [Địa chỉ] = @diachi, SDT = @sdt
		from khachhang kh
		inner join donhang d on kh.[Mã đơn] = d.[Mã đơn]
		where kh.[Mã đơn] = d.[Mã đơn]

		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã sửa thành công!"}')
		select @json as json;
	end
	---------------------------
	else if(@action = 'cong_thuc')
	begin
		select @json += FORMATMESSAGE(N'{"congthuc":"%s","tenbanh":"%s","mabanh":"%s"},', [Công thức], [Tên bánh],[Mã bánh])
		from congthuc
		where [Mã bánh] = @mabanh
	
	if((@json is null)or(@json=''))
	select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				SET @json = REPLACE(@json, CHAR(10), ''); 
				SET @json = REPLACE(@json, CHAR(13), ''); 
				SET @json = REPLACE(@json, CHAR(9), '');   
				select @json = REPLACE(@json, '(null)', 'null');
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+N']}' as json;
				
			end
	end

	--------------------------------------
	else if (@action = 'doanh_thu')
	begin

		select @json += FORMATMESSAGE(N'{"tongtien":%d, "thiethai":%d, "delat":"%s"},',
		dh.[Tổng tiền], th.[Thiệt hại],CONVERT(nvarchar, dh.del_at, 23) )

		from donhang dh
		INNER JOIN khachhang kh ON dh.[Mã đơn] = kh.[Mã đơn]
		INNER JOIN slban sb ON dh.[Mã đơn] = sb.[Mã đơn]
		INNER JOIN banh b ON sb.[Mã chi tiết] = b.[Mã chi tiết]
		inner join thiethai th on dh.[Mã đơn] = th.[Mã đơn]
		where del_at is null
		and [Ngày đặt] >= @ngayvao AND [Ngày đặt] <= @ngayra
		--select goi thang delat ra

		if((@json is null)or(@json=''))
		select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else	
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end


	----------------
	else if(@action = 'don_da_xoa')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":"%s","delat":"%s"},',
				[Mã đơn],[Mã khách hàng], CONVERT(nvarchar, del_at, 23))

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
end
