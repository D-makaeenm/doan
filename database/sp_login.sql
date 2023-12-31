USE [doan3an1]
GO
/****** Object:  StoredProcedure [dbo].[ql_taikhoan]    Script Date: 28/11/2023 7:00:29 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[ql_taikhoan]
	@action nvarchar(50) = 'logins',
	@tk nvarchar(50) = null,
	@mk nvarchar(50) = null
as
begin
	declare @json nvarchar(max)='';
	if(@action = 'logins')
	begin
		select @json+=FORMATMESSAGE(N'{"tk":"%s","mk":"%s","roles":%d},',
				[Tên đăng nhập],[Mật khẩu], roles)
		from loginss
		if((@json is null)or(@json=''))
			select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else
			begin
				select @json=REPLACE(@json,'(null)','null')
				select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
			end
	end
end
