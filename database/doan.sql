
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


drop table banh
drop table slban


create table banh
(
	[Mã bánh] nchar(10)  primary key,
	[Tên bánh] nvarchar(50),
	Size nchar(10),
	[Giá nhập] int null,
	[Giá bán] int null,
)

drop table nhapbanh

drop table kho

create table kho
(
	[Mã bánh] nchar(10) null,
	[Tên bánh] nvarchar(50) null,
	Size nchar(10) null,
	[Số lượng] int null,
)

create table nhapbanh
(
	[Mã đơn nhập] int identity(1,1) primary key,
	[Ngày nhập] datetime,
	[Mã xưởng] nvarchar(50),
	[Tên xưởng] nvarchar(50),
	[Số điện thoại] nvarchar(50),
	del_at datetime null,
	done_at datetime null
)

create table chitietnhap
(
	[Mã bánh] nchar(10),
	[Tên bánh] nvarchar(50),
	[Số lượng] int null,
	[Ngày nhập] datetime,
	[Mã đơn nhập] int,
	[Tổng tiền] int,
	Size nchar(10),
	constraint FK_chitietnhap_banh foreign key ([Mã bánh]) REFERENCES banh([Mã bánh]),
	constraint FK_chitietnhap_nhapbanh foreign key ([Mã đơn nhập]) REFERENCES nhapbanh([Mã đơn nhập])
)

drop table chitietnhap
drop table nhapbanh
drop table kho
drop table khoban
drop table slban
drop table doanhthu
drop table donhang
drop table khachhang

create table khoban
(
	[Mã bánh] nchar(10),
	[Số lượng] int,
	[Tên bánh] nvarchar(50),
	Size nchar(10),
	[Ngày đặt] datetime,
)

create table slban
(
	[Mã đơn] int,
	[Tên khách hàng] nvarchar(50),
	[Tên bánh] nvarchar(50),
	Size nchar(10),
	[Mã bánh] nchar(10),
	[Ngày đặt] datetime,
	[Số lượng] int
	constraint FK_slban_donhang foreign key ([Mã đơn]) REFERENCES donhang([Mã đơn]),
	constraint FK_slban_banh foreign key ([Mã bánh]) REFERENCES banh([Mã bánh])
)


create table doanhthu
(
	[Tiền thu] int null,
	[Tiền chi] int null,
	[Doanh thu] int null,
	[Xem lúc] datetime null
)

create table donhang
(
	[Mã đơn] int identity(1,1) not null primary key,
	[Mã khách hàng] int,
	[Tên khách hàng] nvarchar(50),
	[Tổng tiền] int null, -- thằng này tính theo số lượng bánh vd: pz hải sản size s 90k bán 2 cái -> tt = sl x giá 
	[Ngày đặt] datetime,
	del_at datetime null,
	done_at datetime null
	constraint FK_donhang_khachhang foreign key ([Mã khách hàng]) REFERENCES khachhang([Mã khách hàng])
)

DBCC CHECKIDENT ('donhang', RESEED, 0);--đặt identity về 1

create table khachhang
(
	[Mã khách hàng] int identity(1,1) primary key,
	[Tên khách hàng] nvarchar(50),
	[Địa chỉ] nvarchar(50),
	SDT	nvarchar(50),
)


drop table phanhoi

create table phanhoi
(	
	[Nội dung] nvarchar(max) null,
	[Tên khách hàng] nvarchar(50) null,
	[Tên bánh] nvarchar(50) null
)

create table login
(
	[Tên đăng nhập] nvarchar(50),
	[Mật khẩu] nvarchar(50)
	roles 
)
