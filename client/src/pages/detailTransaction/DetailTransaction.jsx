import "./detailTransaction.css"
import { useState, useEffect } from "react";
import Axios from "axios";
import { useRouteMatch } from 'react-router-dom';

export default function DetailTransaction() {
    const [nama, setNama] = useState("");
    const [handphone, setHandphone] = useState("");
    const [jenis, setJenis] = useState("");
    const [berat, setBerat] = useState("");
    const [paket, setPaket] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [harga, setHarga] = useState("");
    const [status, setStatus] = useState("");
    const [tglMasuk, setTglMasuk] = useState("");
    const [tglSelesai, setTglSelesai] = useState("");

    const {
        params: { id },
    } = useRouteMatch('/detail/:id');

    const formatter = (value) => {
        return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    const dateFormatter = (date) => {
        var newDate = new Date(date)
        return newDate.getDate() + '/' + (newDate.getMonth()+1) + '/' + newDate.getFullYear();
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/getTransactionById/" + id).then((response) => {
            setNama(response.data[0].nama);
            setHandphone(response.data[0].handphone);
            setJenis(response.data[0].jenis);
            setBerat(response.data[0].berat + " Kg");
            setPaket(response.data[0].paket);
            setKeterangan(response.data[0].keterangan);
            setHarga('Rp. ' + formatter(response.data[0].harga));
            setStatus(response.data[0].status);
            setTglMasuk(response.data[0].tgl_masuk);
            setTglSelesai(response.data[0].tgl_selesai);
        });
    });

    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">Detail Transaction</h1>
            </div>
            <div className="userContainer">
                <div className="userUpdate">
                    <form className="userUpdateForm">
                        <div className="userUpdateLeft">
                            <div className="userUpdateItem">
                                <label>Nama</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={nama}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>No. Handphone</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={handphone}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Jenis laundry</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={jenis}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Berat</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={berat}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>status</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={status}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                        <div className="userUpdateLeft">
                            <div className="userUpdateItem">
                                <label>Paket</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={paket}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Tanggal Masuk</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={dateFormatter(tglMasuk)}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Tanggal Selesai</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={dateFormatter(tglSelesai)}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Tagihan</label>
                                <input
                                    type="text"
                                    className="userUpdateInput"
                                    value={harga}
                                    readOnly={true}
                                />
                            </div>
                            <div className="userUpdateItem">
                                <label>Keterangan</label>
                                <textarea
                                    type="text"
                                    // className="userUpdateInput"
                                    value={keterangan}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
