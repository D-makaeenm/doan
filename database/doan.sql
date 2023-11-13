
USE [doan3an1]
GO
USE [doan3an1]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create procedure [dbo].[ql_don]
	@action nvarchar(50) = 'list_don_hang',
	@madon int = null,
	@makh nvarchar(255) = null,
	@ngaydat date = null,
	@tongtien nvarchar(255) = null,
	@tk nvarchar(50) = null,
	@mk nvarchar(50) = null
as
begin
	declare @json nvarchar(max)='';
	if(@action = 'list_don_hang')
	begin
		select @json+=FORMATMESSAGE(N'{"madon":%d,"makh":"%s","tongtien":%d,"ngaydat":"%s"},',
				[Mã đơn],[Mã khách hàng],CONVERT(NVARCHAR, [Tổng tiền]), CONVERT(nvarchar, [Ngày đặt], 23))
		from donhang
		if((@json is null)or(@json=''))
			select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
end



--create table nguyenlieu
--(
--	[Mã nguyên liệu] nchar(10) primary key,
--	[Tên nguyên liệu] nvarchar(50),
--	[Số lượng] int,
--	[Đơn giá] int,
--	[Tổng tiền] int,
--	[Mã chi tiết] nchar(10)
--	constraint FK_nguyenlieu_banh foreign key ([Mã chi tiết]) REFERENCES banh([Mã chi tiết])
--)

drop table nguyenlieu
drop table banh
drop table slban

alter table nguyenlieu
alter column [Tổng tiền] int


create table banh
(
	[Mã chi tiết] nchar(10) primary key,
	[Mã bánh] nchar(10),
	[Tên bánh] nvarchar(50),
	Size nchar(10),
	[Giá tiền] int--thằng này là tiền 1 cái
)


create table slban --thằng này chiếu đến donhang qua mã đơn -> thằng này phải có khóa riêng và 1 thuộc tính của thằng cha
(
	[Mã chi tiết] nchar(10),
	[Mã đơn] int,
	[Mã khách hàng] nvarchar(50),
	[Mã bánh] nchar(10),
	[Số lượng] int
	constraint FK_slban_donhang foreign key ([Mã đơn]) REFERENCES donhang([Mã đơn]),
	constraint FK_slban_banh foreign key ([Mã chi tiết]) REFERENCES banh([Mã chi tiết])
)

drop table slban
drop table donhang
drop table khachhang
drop table doanhthu

create table donhang
(
	[Mã đơn] int identity(1,1) not null,
	[Mã khách hàng] nvarchar(50) not null,
	[Tổng tiền] int null, -- thằng này tính theo số lượng bánh vd: pz hải sản size s 90k bán 2 cái -> tt = sl x giá 
	[Ngày đặt] date null,
	del_at datetime null
 CONSTRAINT PK_donhang PRIMARY KEY CLUSTERED 
(
	[Mã đơn] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

DBCC CHECKIDENT ('donhang', RESEED, 0);--đặt identity về 1


create table khachhang
(
	[Mã khách hàng] nvarchar(50) primary key,
	[Mã đơn] int,
	[Tên khách hàng] nvarchar(50),
	[Địa chỉ] nvarchar(50),
	SDT	nvarchar(50)
	CONSTRAINT PK_khachhang_donhang foreign key ([Mã đơn]) REFERENCES donhang([Mã đơn])
)

create table login
(
	[Tên đăng nhập] nvarchar(50),
	[Mật khẩu] nvarchar(50)
)

create table thiethai
(
	[Mã khách hàng] nvarchar(50) null,
	[Mã đơn] int null,
	[Thiệt hại] int null
	constraint FK_thiethai_donhang foreign key ([Mã đơn]) REFERENCES donhang([Mã đơn]),
)

create table congthuc
(
	[Mã bánh] nchar(10),
	[Tên bánh] nvarchar(50),
	[Công thức] nvarchar(max)
)
