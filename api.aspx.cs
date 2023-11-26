using doan3an1;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace doan
{
    public partial class api : System.Web.UI.Page
    {
        void xuly_donhang(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cmd = db.GetCmd("ql_don", action);
            switch (action)
            {
                case "list_don_hang":
                case "them_don_hang":
                case "cong_thuc":
                case "edit_don_hang":
                case "xoa_don_hang":
                case "done_don_hang":
                case "don_da_xoa":
                case "don_da_done":
                    cmd.Parameters.Add("@congthuc", SqlDbType.NVarChar, -1).Value = Request["congthuc"];
                    cmd.Parameters.Add("@ngaydat", SqlDbType.Date).Value = Request["ngaydat"];
                    cmd.Parameters.Add("@mabanh", SqlDbType.NVarChar, 10).Value = Request["mabanh"];
                    cmd.Parameters.Add("@makh", SqlDbType.NVarChar, 255).Value = Request["makh"];
                    cmd.Parameters.Add("@size", SqlDbType.NVarChar, 10).Value = Request["size"];
                    cmd.Parameters.Add("@tenkh", SqlDbType.NVarChar, 255).Value = Request["tenkh"];
                    cmd.Parameters.Add("@tenbanh", SqlDbType.NVarChar, 255).Value = Request["tenbanh"];
                    cmd.Parameters.Add("@giaban", SqlDbType.Int).Value = Request["giaban"];
                    cmd.Parameters.Add("@sl", SqlDbType.Int).Value = Request["sl"];
                    cmd.Parameters.Add("@tongtien", SqlDbType.Int).Value = Request["tongtien"];
                    cmd.Parameters.Add("@diachi", SqlDbType.NVarChar, 255).Value = Request["diachi"];
                    cmd.Parameters.Add("@sdt", SqlDbType.NVarChar, 255).Value = Request["sdt"];
                    cmd.Parameters.Add("@delat", SqlDbType.Date).Value = Request["delat"];
                    cmd.Parameters.Add("@doneat", SqlDbType.Date).Value = Request["doneat"];
                    cmd.Parameters.Add("@madon", SqlDbType.Int).Value = Request["madon"];
                    break;
            }
            switch (action)
            {
                case "doanh_thu":
                    cmd.Parameters.Add("@thiethai", SqlDbType.Int).Value = Request["thiethai"];
                    cmd.Parameters.Add("@ngayvao", SqlDbType.Date).Value = Request["ngayvao"];
                    cmd.Parameters.Add("@ngayra", SqlDbType.Date).Value = Request["ngayra"];
                    break;
                
            }
            string json = (string)db.Scalar(cmd);
            Response.Write(json);
        }

        void nhap_hang(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cmd = db.GetCmd("ql_don", action);
            switch (action)
            {
                case "list_don_nhap":
                case "them_don_nhap":
                case "don_nhap_da_xoa":
                case "xoa_don_nhap":
                    cmd.Parameters.Add("@madonnhap", SqlDbType.Int).Value = Request["madonnhap"];
                    cmd.Parameters.Add("@ngaynhap", SqlDbType.DateTime).Value = Request["ngaynhap"];
                    cmd.Parameters.Add("@mancc", SqlDbType.NVarChar,255).Value = Request["mancc"];
                    cmd.Parameters.Add("@tenncc", SqlDbType.NVarChar, 255).Value = Request["tenncc"];
                    cmd.Parameters.Add("@sdtncc", SqlDbType.NVarChar, 255).Value = Request["sdtncc"];
                    cmd.Parameters.Add("@tenbanh", SqlDbType.NVarChar, 255).Value = Request["tenbanh"];
                    cmd.Parameters.Add("@sln", SqlDbType.Int).Value = Request["sln"];
                    cmd.Parameters.Add("@tongtienhap", SqlDbType.Int).Value = Request["tongtiennhap"];
                    cmd.Parameters.Add("@size", SqlDbType.NVarChar, 10).Value = Request["size"];
                    cmd.Parameters.Add("@delat", SqlDbType.Date).Value = Request["delat"];
                    cmd.Parameters.Add("@doneat", SqlDbType.Date).Value = Request["doneat"];
                    break;
            }
            string json = (string)db.Scalar(cmd);
            Response.Write(json);
        }

        void logins(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cmd = db.GetCmd("ql_taikhoan", action);
            string json = (string)db.Scalar(cmd);
            Response.Write(json);//thang nay xuot du lieu trong db thanh chuoi trong json
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
            switch(action)
            {
                case "list_don_hang":
                case "them_don_hang":
                case "don_da_xoa":
                case "don_da_done":
                case "done_don_hang":
                case "cong_thuc":
                case "edit_don_hang":
                case "xoa_don_hang":
                case "doanh_thu":
                    xuly_donhang(action);
                    break;
                case "logins":
                    logins(action);
                    break;
                case "list_don_nhap":
                case "them_don_nhap":
                case "don_nhap_da_xoa":
                case "xoa_don_nhap":
                    nhap_hang(action);
                    break;
            }
        }
    }
}