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
                    xuly_donhang(action);
                    break;
                case "logins":
                    logins(action);
                    break;
            }
        }
    }
}