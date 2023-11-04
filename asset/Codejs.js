$(document).ready(function () {
    const api = '/api.aspx'
    //------------------------------------------------------------------
    $('#btn-login').click(function () {
        $.confirm({
            
            title: "Đăng nhập",
            content: ``
                + `<form action="" class="form_name">` +
                `<div class="form-group">` +
                `<label>Tài khoản</label>` +
                `<input type="text" placeholder="Tài khoản" class="tk form-control" required />` +
                `<label>Mật khẩu</label>` +
                `<input type="text" placeholder="Mật khẩu" class="mk form-control" required />` +
                `</div` +
                `</form>`
            ,
            buttons: {
                formSumbit: {
                    text: 'Đăng nhập',
                    btnClass: 'btn-blue',
                    action: function () {
                        var tkb = this.$content.find('.tk').val();
                        var mkb = this.$content.find('.mk').val();
                        if (!tkb || !mkb) {
                            $.alert('Bạn chưa điền gì cả !');
                            return false;
                        }
                        else {
                            $.post(api, { action: 'logins' },
                                function (data) {
                                    //alert(data)//{"ok":1,"msg":"ok","data":[{"tk":admin,"mk":"123"}]}
                                    var json = JSON.parse(data);//chuyen text trong data -> doi tuonng 
                                    var loginok = false;
                                    if (json.ok) {
                                        for (var tt of json.data) {
                                            if (tt.tk == tkb && tt.mk == mkb) {
                                                loginok = true;
                                                break;
                                            }
                                        }
                                        if (loginok) {
                                            $.alert("Đăng nhập thành công!");
                                        }
                                        else {
                                            $.alert("Sai tài khoản hoặc mật khẩu!");
                                            return false;
                                            
                                        }
                                    }
                                })
                        }
                    }
                },
                somethingElse: {
                    text: 'Thoát',
                    btnClass: 'btn-red' 
                }
            },
            onContentReady: function () {
                
            }
        })
    });




    //--------------------------------------------------------------
    $('#xem-don').click(function () {
        //alert('hehehe')
        $.confirm({
            title: "Danh sách đơn hàng",
            content: `<div id="ds_don_hang">Loading......</div>`,
            ColumnClass: 'large',
            onContentReady: function () {
                $.post(api, { action: 'list_don_hang' },
                    function (data) {
                        //alert(data)
                        var json = JSON.parse(data);
                        var noidung = "";
                        if (json.ok) {
                            noidung += "<table>";
                            for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                                noidung += `Mã đơn: ${dh.madon}<br>Mã khách hàng: ${dh.makh}<br>`
                            }
                            noidung += "</table>"
                        }
                        else {
                            noidung = " khong co du lieu";
                        }
                    $('#ds_don_hang').html(noidung);
                })
            }
        });
    });
})