function refresh_content() {
    $.ajax({
        url: "/noted/control.php",
        type: "POST",
        data: {
            refresh: "ok"
        }
    }).done(function(response) {
        var print = "";
        response = JSON.parse(response);
        response = response.reverse();
        response.forEach(data => {
            print += (`
                <div class="col s12 m6">
                    <div class="card">
                        <div class="card-image">
                            <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="alert_delete('${data.id}','${data.title}')"><i class="material-icons">delete_forever</i></a>
                        </div>
                        <div class="card-content">
                            <div class="row">
                                <div class="col s12" align="center">
                                    <h6>
                                        <b>${data.title}</b>
                                    </h6>
                                </div>
                                <div class="input-field col s12">
                                    <i class="material-icons prefix">description</i>
                                    <textarea id="content-${data.id}" class="materialize-textarea">${data.content}</textarea>
                                </div>
                                <div class="col s12">
                                    <a class="waves-effect waves-light btn full" onclick="copy_content('content-${data.id}')">
                                        <i class="material-icons left">content_copy</i>copy this content
                                    </a>
                                    <div align="center">
                                        <br>
                                        ${data.datetime}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
        document.getElementById("content").innerHTML = print;
    });
}

function claer_input() {
    document.getElementById("input-title").value = null; //kosongkan
    document.getElementById("input-content").value = null; //kosongkan
}

function title_value() {
    return document.getElementById("input-title").value;
}

function content_value() {
    return document.getElementById("input-content").value;
}

function copy_content(id) {
    var copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    M.toast({
        html: `Copied the text!`,
        completeCallback: function() {
            //kosong
        }
    })
}
window.onload = () => {
    claer_input();
    refresh_content();
    document.getElementById("submit").addEventListener("click", function() {
        if (title_value() != "" && content_value() != "") {
            var title = document.getElementById("input-title").value;
            var content = document.getElementById("input-content").value;
            $.ajax({
                url: "/noted/control.php",
                type: "POST",
                data: {
                    submit: "ok",
                    title: title,
                    content: content
                }
            }).done(function(response) {
                if (response == "ok") {
                    refresh_content();
                    M.toast({
                        html: `Your content has been saved!`,
                        completeCallback: function() {
                            //kosong
                        }
                    })
                } else {
                    alert(response)
                }
            });
            claer_input();
        } else {
            M.toast({
                html: `The input box cannot be empty!`,
                completeCallback: function() {
                    refresh_content()
                }
            })
        }
    });
}

function alert_delete(id, nama) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success btn-plus',
            cancelButton: 'btn btn-danger btn-minus'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: '<font class="font-regular">Apa kamu yakin?</font>',
        html: `ingin menghapus <b>${nama}</b>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Tidak Jadi!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'Password Required:',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'HAPUS!',
                confirmButtonColor: "#DD6B55",
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                    return fetch(`/noted/control.php?pass=${password}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.statusText)
                            }
                            return response.json()
                        })
                        .catch(error => {
                            Swal.showValidationMessage(
                                `Password salah!`
                            )
                        })
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    if (result.value.status == "ok") {
                        $.ajax({
                            url: "/noted/control.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                delete: result.value.status,
                                id: id
                            },
                            success: function(response) {
                                if (response.status == "ok") {
                                    refresh_content();
                                    M.toast({
                                        html: `<font class='font-regular'>"<b><i>${response.title}</i></b>" was removed!</font>`,
                                        completeCallback: function() {
                                            //kosong
                                        }
                                    })
                                }
                            }
                        });
                    }
                } else {
                    M.toast({
                        html: "<font class='font-regular'>delete data is canceled</font>",
                        completeCallback: function() {
                            //kosong
                        }
                    })
                }
            })
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            M.toast({
                html: "<font class='font-regular'>delete data is canceled</font>",
                completeCallback: function() {
                    //kosong
                }
            })
        }
    });
}