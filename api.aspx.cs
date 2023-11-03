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
                case "them_don_hang":
                    cmd.Parameters.Add("@makh", SqlDbType.NVarChar, 255).Value = Request["Mã khách hàng"];
                    cmd.Parameters.Add("@mabanh", SqlDbType.NVarChar, 255).Value = Request["Mã bánh"];
                    cmd.Parameters.Add("@tongtien", SqlDbType.Float).Value = Request["Tổng tiền"];
                    break;
            }
            string json = (string)db.Scalar(cmd);
            Response.Write(json);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
            switch(action)
            {
                case "list_don_hang":
                case "them_don_hang":
                    xuly_donhang(action);
                    break;
            }
        }
    }
}