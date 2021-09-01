import "./newUser.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

export default function NewUser() {
  const [ListPaket, setListPaket] = useState([]);
  const [transaction, setTransaction] = useState([]);

  const [nama, setNama] = useState("");
  const [handphone, setHandphone] = useState("");
  const [jenis, setJenis] = useState("");
  const [berat, setBerat] = useState("");
  const [paket, setPaket] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [lama_cuci, setLamaCuci] = useState("");
  const [harga, setHarga] = useState("");
  const [diskon, setDiskon] = useState(0)

  const history = useHistory();

  useEffect(() => {
    Axios.get("http://localhost:3001/paket").then((response) => {
      setListPaket(response.data);
    });
  }, []);

  const getDetailPaket = async (event) => {
    console.log(event.target.value)
    setPaket(event.target.value);
    for (let index = 0; index < ListPaket.length; index++) {
      if (ListPaket[index].nama_paket === event.target.value) {
        setLamaCuci(ListPaket[index].lama_cuci);
        setHarga(ListPaket[index].harga);
        setDiskon(ListPaket[index].diskon);
      }
    }
  }

  const validateForm = () => {
    if (nama === '' || handphone === '' || jenis === '' ||
      berat === '' || paket === '' || keterangan === '') {
      return false
    } else {
      return true
    }
  }

  const newTransaction = () => {
    Axios.post("http://localhost:3001/addTransaction", {
      nama: nama,
      handphone: handphone,
      jenis: jenis,
      berat: berat,
      paket: paket,
      keterangan: keterangan,
      lama_cuci: lama_cuci,
      harga: harga,
      diskon: diskon
    }).then(() => {
      setTransaction([
        ...transaction,
        {
          nama: nama,
          handphone: handphone,
          jenis: jenis,
          berat: berat,
          paket: paket,
          keterangan: keterangan,
          lama_cuci: lama_cuci,
          harga: harga,
          diskon: diskon
        },
      ]);
    });
  }

  const addTransaction = async () => {
    await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Transaksi baru akan ditambahkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Created!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        newTransaction();
        await Swal.fire({
          icon: 'success',
          title: 'Data berhasil ditambahkan!!',
          showConfirmButton: false,
          timer: 1000
        })
        await history.push("/");
      }
    })
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New Customer</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Nama</label>
          <input onChange={(event) => {
            setNama(event.target.value);
          }} type="text" />
        </div>
        <div className="newUserItem">
          <label>No. Handphone</label>
          <input onChange={(event) => {
            setHandphone(event.target.value);
          }} type="number" placeholder="Ganti angka 0 dengan 62" />
        </div>
        <div className="newUserItem">
          <label>Jenis Laundry</label>
          <select className="newUserSelect" onChange={(event) => {
            setJenis(event.target.value);
          }} name="active" id="active">
            <option>-</option>)
            <option value="Laundy kiloan">Laundy kiloan</option>
            <option value="Laundry satuan">Laundry satuan</option>
          </select>
        </div>
        <div className="newUserItem">
          <label>Berat (Kg) / Jumlah (satuan)</label>
          <input onChange={(event) => {
            setBerat(event.target.value);
          }} type="number" />
        </div>
        <div className="newUserItem">
          <label>Paket</label>
          <select className="newUserSelect" onChange={(event) => {
            getDetailPaket(event);
          }} name="active" id="active">
            <option key={0}>-</option>)
            {
              ListPaket.map((x) =>
                <option key={x.id} value={x.nama_paket}>{x.nama_paket}</option>)
            }
          </select>
        </div>
        <div className="newUserItem">
          <label>Keterangan</label>
          <textarea onChange={(event) => {
            setKeterangan(event.target.value);
          }} type="text" />
        </div>
      </form>
      <button disabled={!validateForm()} onClick={addTransaction} className="newUserButton">Create</button>
    </div>
  );
}
