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
                `<input type="password" placeholder="Mật khẩu" class="mk form-control" required />` +
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
                                            $.alert("Đăng nhập thành côngss!");
                                            $('#btn-login').hide();
                                            goihello();
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
    
    function list_don() {
        $.confirm({
            title: "Danh sách đơn hàng",
            content: `<div id="ds_don_hang">Loading......</div>`,
            columnClass: 'col-md-12',
            buttons: {
                add: {
                    text: "Thêm đơn",
                    action: function () {
                        them_don();
                        return false;
                    }
                },
                Close: {
                    btnClass: 'btn-red any-other-class'
                }
            },
            
            onContentReady: function () {
                capnhatdonhang();
            }
        });
    }

    function capnhatdonhang() {
        $.post(api, { action: 'list_don_hang' },
            function (data) {
             
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover">`;
                    noidung += `<thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Mã khách hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Tên bánh</th>
                        <th>Size</th>
                        <th>Số lượng</th>
                        <th>Giá tiền</th>
                        <th>Tổng tiền</th>
                    </tr>
                    </thead><tbody>`;
                    var stt = 0;
                    for (var dh of json.data) {//moi 1 don hang trong json thi lam gi (lay thuoc tinh moi don hang )
                        var tongtien = dh.giatien * dh.sl;
                        var sua_xoa = `<button class="btn btn-sm btn-warning nut-sua-xoa" data-idd="${dh.madon}" data-action="edit_company">Sửa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-idd="${dh.madon}" data-action="delete_company">Xóa</button>`;
                        noidung += `
                        <tr>
                            <td>${++stt}</td>
                            <td>${dh.madon}</td>
                            <td>${dh.makh}</td>
                            <td>${dh.tenkh}</td>
                            <td>${dh.tenbanh}</td>
                            <td>${dh.size}</td>
                            <td>${dh.sl}</td>
                            <td>${dh.giatien}</td>
                            <td>${tongtien}</td>
                            <td>${sua_xoa}</td>
                        </tr>`; 
                    }
                    noidung += "</tbody></table>"
                }
                else {
                    noidung = " khong co du lieu";
                }
                $('#ds_don_hang').html(noidung);

                $('.nut-sua-xoa').click(function () {
                    //phân biệt các nút bằng data kèm theo
                    var action = $(this).data('action')  //lấy action kèm theo
                    var madon = $(this).data('idd')  //lấy cid kèm theo
                    if (action == 'xoa_don_hang') { //dùng action
                        //can xac nhan
                        xoa_don(madon, json); //dùng id vào đây để hàm này xử, cho khỏi rối code
                    } else if (action == 'edit_don_hang') {
                        //ko can xac nhan
                        sua_don(madon, json);
                    }
                });
            }
        )
    }

    function xoa_don(madon, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madon == madon) {
                don = obj;
                break;
            }
        }


        var dialog_xoa = $.confirm({
            title: `Bạn có muốn xóa công ty ${don.madon}`,
            content: `Xóa nhé fen ?`,
            buttons: {
                YES: {
                    action: function () {
                        var data_gui_di = {
                            action: 'xoa_don_hang',
                            madon: madon,
                        }
                        $
                    }
                }
            }
        });
    }

    function sua_don(madon, json) {
        var don;
        for (var obj of json.data) {
            if (obj.madon == madon) {
                don = obj;
                break;
            }
        }
        var dialog_edit = $.confirm({

        });



    }







    function goihello() {
        $('#hello').show();
    }
    //--------------------------------------------------------------

    function test() {
        var dialog_add = $.confirm({
            title: `Thêm mới đơn hàng`,
            content: '' +
                '<label>Mã khách hàng:</label>' + '<input class="name form-control" id="nhap-makh">' + 
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "ngay-dat" type="date" name="datePicker"><br>'
            ,
            buttons: {
                save: {
                    text: `Thêm đơn hàng vào database`,
                    action: function () {
                        
                        var ngaydat = $('#ngay-dat').val();
                        var makh = $('#nhap-makh').val();
                        if (makh === "" || ngaydat === "") {
                            alert("Hãy nhập đủ dữ liệu");
                            return false;
                        }
                        else {
                            var data_gui_di = {
                                action: 'tong_tien',
                                makh: makh,
                                ngaydat: ngaydat
                            }
                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                alert("da gui thanh cong");
                                if (json.ok) {
                                    dialog_add.close();
                                }
                                else {
                                    alert(json.msg);
                                }
                            });
                        }
                    }
                },
                close: {

                }
            }
        });
    }




    //---------------------------------------------------------------

    function them_don() {
        var dialog_add = $.confirm({
            title: `Thêm mới đơn hàng`,
            content: '' +
                '<label>Mã khách hàng:</label>' + '<input class="name form-control" id="nhap-makh">' +
                '<label>Tên khách hàng:</label>' + '<input class="name form-control" id="ten-kh">' +
                '<label>Địa chỉ:</label>' + '<input class="name form-control" id="dia-chi">' +
                '<label>SDT</label>' + '<input class="name form-control" id="sdt">'+
                '<label style = "margin-top:10px"> Ngày đặt:</label>' + '<input style = "margin-top:10px" id = "ngay-dat" type="date" name="datePicker"><br>' +
                '<label style = "margin-top:10px">Mã bánh:</label>' +
                '<select name="mabanh" style = "margin-top:10px" id= "ma-banh"><option value="pz-01">pz-01</option><option value="pz-02">pz-02</option><option value="pz-03">pz-03</option><option value="pz-04">pz-04</option><option value="pz-05">pz-05</option><option value="pz-06">pz-06</option></select><br>' +
                `<label style = "margin-top:10px">Size:</label>` +
                `<select style = "margin-left:35px" name="size" id="size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                </select><br>`+
                `<label style = "margin-top:10px">Số lượng:</label>` + '<input style = "margin-top:10px" id="sl"><br>'
                ,
            buttons: {
                save: {
                    text: `Thêm đơn hàng vào database`,
                    action: function () {
                        var makh = $('#nhap-makh').val();
                        var tenkh = $('#ten-kh').val();
                        var ngaydat = $('#ngay-dat').val();
                        var mabanh = $('#ma-banh').val();
                        var size = $('#size').val();
                        var sl = $('#sl').val();
                        var diachi = $('#dia-chi').val();
                        var sdt = $('#sdt').val();
                        if (makh === "" || ngaydat === "" || size === "" || tenkh === "" || mabanh === "" || sl==="" || diachi ===""|| sdt ==="") {
                            alert("Hãy nhập đủ dữ liệu");
                            return false;
                        }
                        else {
                            var data_gui_di = {
                                action: 'them_don_hang',
                                makh: makh,
                                ngaydat: ngaydat,
                                mabanh: mabanh,
                                size: size,
                                tenkh: tenkh,
                                sl: sl,
                                diachi: diachi,
                                sdt:sdt
                            }
                            $.post(api, data_gui_di, function (data) {
                                console.log(data_gui_di);
                                var json = JSON.parse(data);
                                alert("da gui thanh cong");
                                if (json.ok) {
                                    dialog_add.close();
                                }
                                else {
                                    alert(json.msg);
                                }
                            });
                        }
                    }
                },
                close: {

                }
            }
        });
    }
    $('#them-don').click(function () {
        them_don();
    });
    $('#xem-don').click(function () {
        list_don();
    });

    $('#test-cn').click(function () {
        test();
    });
})

//-------------------------------------------------------------
