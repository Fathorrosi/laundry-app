import "./Paket.css"
import { DataGrid } from "@material-ui/data-grid";
import { useState, useEffect } from "react";
import Axios from "axios";
import { DeleteOutline } from "@material-ui/icons";
import Swal from 'sweetalert2'

export default function Paket() {
    const [listPaket, setListPaket] = useState([])
    const [namaPaket, setNamaPaket] = useState("")
    const [lamaCuci, setLamaCuci] = useState(0)
    const [harga, setHarga] = useState(0)
    const [diskon, setDiskon] = useState(0)

    useEffect(() => {
        Axios.get("http://localhost:3001/paket").then((response) => {
            setListPaket(response.data);
        });
    }, [])

    const validateForm = () => {
        if (namaPaket === '' || lamaCuci === '' || harga === '') {
            return false
        } else {
            return true
        }
    }

    const handleAdd = () => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Paket baru akan ditambahkan.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Created!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Axios.post("http://localhost:3001/addPaket",
                    { namaPaket: namaPaket, lamaCuci: lamaCuci, harga: harga, diskon: diskon });
                await Swal.fire({
                    icon: 'success',
                    title: 'Paket berhasil ditambahkan!!',
                    showConfirmButton: false,
                    timer: 1000
                });
                await window.location.reload(false);
            }
        })
    }

    const handleUpdate = (id, namaPaket, lamaCuci, harga, diskon) => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Data paket akan diupdate.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update!'
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.put("http://localhost:3001/updatePaket",
                    { id: id, namaPaket: namaPaket, lamaCuci: lamaCuci, harga: harga, diskon: diskon });
                Swal.fire({
                    icon: 'success',
                    title: 'Paket berhasil diupdate!!',
                    showConfirmButton: false,
                    timer: 1000
                })
                setTimeout(() => {
                    window.location.reload(false);
                }, 1500);
            }
        })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Data paket akan dihapus.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Deleted!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Axios.delete("http://localhost:3001/deletePaket/" + id);
                await Swal.fire({
                    icon: 'success',
                    title: 'Paket berhasil dihapus!!',
                    showConfirmButton: false,
                    timer: 1000
                });
                await window.location.reload(false);
            }
        })
    }

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "nama_paket", headerName: "Nama Paket", width: 200, editable: true },
        { field: "lama_cuci", headerName: "Lama Pengerjaan", width: 200, editable: true },
        { field: "harga", headerName: "Harga", width: 200, tipe: Date, editable: true },
        { field: "diskon", headerName: "Diskon", width: 200, tipe: Date, editable: true },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <button onClick={() => handleUpdate(
                            params.row.id, params.row.nama_paket, params.row.lama_cuci, params.row.harga, params.row.diskon)}
                            className="userListDetail">Update</button>
                        <DeleteOutline
                            className="userListDelete"
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </>
                );
            },
        }
    ];

    return (
        <div className="blast">
            <DataGrid
                rows={listPaket}
                disableSelectionOnClick
                columns={columns}
                pageSize={5}
                className="table"
            // checkboxSelection
            />
            <div className="paketForm">
                <form name="paketForm" className="paketForm">
                    <div className="paketItem">
                        <label>Nama Paket</label>
                        <input onChange={(event) => {
                            setNamaPaket(event.target.value);
                        }} type="text" />
                    </div>
                    <div className="paketItem">
                        <label>Lama Pengerjaaan</label>
                        <input onChange={(event) => {
                            setLamaCuci(event.target.value);
                        }} type="number" />
                    </div>
                    <div className="paketItem">
                        <label>Harga</label>
                        <input onChange={(event) => {
                            setHarga(event.target.value);
                        }} type="number" />
                    </div>
                    <div className="paketItem">
                        <label>Diskon</label>
                        <input onChange={(event) => {
                            setDiskon(event.target.value);
                        }} type="number" />
                    </div>
                </form>
                <div className="paketItem">
                    <button disabled={!validateForm()} onClick={handleAdd} className='paketButton'>Tambah Paket</button>
                </div>
            </div>
        </div>
    );
}
