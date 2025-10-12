/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { EmptyData, ApiResponse } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
// import Spacer from '@mui/material/Spacer';

// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Card from '../component/Card'
import Accordion from '../component/AccordionDashboard'

// NEXT.JS
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import LoginPageImage from '../public/login_page.png'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow: 'none',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const productsName = ["Test", "Test2"]

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Register() {
  const router = useRouter()
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  const [registerData, setRegisterData] = React.useState({
    nama: "",
    email: "",
    telepon: "",
    password: "",
    confirm_password: "",
  });
  const [openTermsCondition, setOpenTermsCondition] = React.useState(false);
  const handleOpen = () => setOpenTermsCondition(true);
  const handleClose = () => setOpenTermsCondition(false);

  const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

    const termsText = `1. Definisi Umum
Toko merujuk pada New Nasional (Diamond Electronic).

Pelanggan adalah pihak individu atau badan yang melakukan transaksi pembelian produk dari Toko.

Produk adalah segala barang elektronik yang dijual oleh Toko.

2. Produk & Ketersediaan
Toko berkomitmen menyediakan produk asli, baru, dan berkualitas sesuai dengan deskripsi.

Ketersediaan produk dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.

Gambar atau foto produk hanya sebagai ilustrasi, sehingga mungkin terdapat perbedaan dalam warna atau detail fisik.

3. Harga & Pembayaran
Semua harga yang tercantum dalam Toko sudah termasuk pajak sesuai peraturan yang berlaku, kecuali dinyatakan lain.

Toko berhak mengubah harga produk sewaktu-waktu tanpa pemberitahuan sebelumnya.

Pembayaran wajib diselesaikan sesuai dengan metode yang tersedia dan sah apabila telah diterima penuh oleh Toko.

4. Pemesanan & Konfirmasi
Pemesanan produk dianggap valid setelah Toko menerima pembayaran.

Toko berhak menolak atau membatalkan pesanan apabila ditemukan adanya kesalahan informasi harga, stok, atau indikasi penyalahgunaan transaksi.

5. Pengiriman & Penyerahan
Produk akan dikirim ke alamat yang telah ditentukan oleh pelanggan sesuai dengan data pesanan.

Estimasi pengiriman bersifat perkiraan dan dapat bervariasi tergantung lokasi serta layanan logistik yang digunakan.

Risiko kehilangan atau kerusakan produk selama pengiriman menjadi tanggung jawab perusahaan logistik setelah barang diserahkan oleh Toko.

6. Garansi & Layanan Purna Jual
Produk yang dijual dilengkapi dengan garansi resmi sesuai dengan kebijakan masing-masing merek atau distributor.

Klaim garansi hanya berlaku apabila pelanggan dapat menunjukkan bukti pembelian yang sah.

Layanan perbaikan atau penggantian mengikuti syarat dari pusat layanan resmi produsen.

7. Pengembalian & Penukaran
Pengembalian atau penukaran hanya dapat dilakukan apabila produk yang diterima dalam keadaan cacat produksi atau tidak sesuai dengan pesanan.

Permintaan pengembalian harus diajukan maksimal 3 x 24 jam setelah produk diterima, disertai bukti foto dan nota pembelian.

Produk harus dikembalikan dalam kondisi asli, lengkap dengan dus, aksesoris, dan segel (jika ada).

8. Pembatasan Tanggung Jawab
Toko tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian penggunaan produk oleh pelanggan.

Toko tidak menjamin bahwa semua deskripsi produk sepenuhnya bebas dari kesalahan, meskipun telah diupayakan ketelitian maksimal.

9. Perubahan Syarat & Ketentuan
Toko berhak mengubah atau memperbarui syarat & ketentuan ini kapan saja. Perubahan akan berlaku sejak tanggal diterbitkan pada media resmi Toko.

10. Hukum yang Berlaku
Syarat & ketentuan ini tunduk dan diatur berdasarkan hukum yang berlaku di Republik Indonesia.`

 async function registerHandler(): Promise<EmptyData> {
    try {
        const response = await axios.post<ApiResponse<EmptyData>>(`/register`, {
            ...registerData
        });
        if(response.data.status) {
            router.push("/login")
            execToast(ToastStatus.SUCCESS, response.data.message)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

  return (
    <Box sx={{backgroundColor: "white"}}>
        <Modal
            open={openTermsCondition}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "black" }}>
                    Syarat & Ketentuan
                </Typography>
                <div style={{height: "50vh", overflowY: "auto"}}>
                    {termsText.split(/\n\n+/).map((para, idx) => (
                        <Typography key={idx} sx={{ color: "black", mt: idx === 0 ? 2 : 1 }}>
                            {para}
                        </Typography>
                    ))}
                </div>
            </Box>
        </Modal>
        <AppBar />
        {/* <button 
            className={styles.button}
            onClick={() => dispatch(increment())}
        >Increment</button>
        <span>{count}</span>
        <button 
            className={styles.button}
            onClick={() => dispatch(decrement())}
        >Decrement</button>
        <button 
            className={styles.button}
            onClick={() => dispatch(incrementByAmount(2))}
        >Increment by 2</button>
        <button onClick={() => router.push("/admin")}>
            to Admin
        </button> */}
        <Grid 
            container 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '0 auto',
                marginTop: "1.5%",
            }}
        >
            <Grid size={6}>
                <Item>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60vh',
                        }}
                        >
                        <Typography variant="h6" component="h6" sx={{color: "black"}}>
                            Daftar Sekarang
                        </Typography> <br />
                        <Typography variant="body2" component="p" sx={{color: "black"}}>
                            Sudah memiliki akun ? <Link href="#" variant="body2" onClick={() => handleRoute("login")}>
                                Login
                            </Link>
                        </Typography> <br />
                        {/* <Avatar sx={{width: "120px", height: "120px"}} /> */}
                        {/* <div style={{marginTop: "1.75%"}} /> */}
                        <TextField 
                            name="nama"
                            value={registerData.nama} 
                            type="text" 
                            label="Nama" 
                            variant="outlined" 
                            sx={{ marginBottom: "1.25%" }} 
                            onChange={handleChange} 
                        />
                        <TextField 
                            name="email"
                            value={registerData.email} 
                            type="email" 
                            label="Email" 
                            variant="outlined" 
                            sx={{ marginBottom: "1.25%" }} 
                            onChange={handleChange} 
                        />
                        <TextField 
                            name="telepon"
                            value={registerData.telepon} 
                            type="text" 
                            label="No Handphone" 
                            variant="outlined" 
                            sx={{ marginBottom: "1.25%" }} 
                            onChange={handleChange} 
                        />
                        <TextField 
                            name="password"
                            value={registerData.password} 
                            type="password" 
                            label="Password" 
                            variant="outlined" 
                            sx={{ marginBottom: "1.25%" }} 
                            onChange={handleChange} 
                        />
                        <TextField 
                            name="confirm_password"
                            value={registerData.confirm_password} 
                            type="password" 
                            label="Confirm Password" 
                            variant="outlined" 
                            onChange={handleChange} 
                        />
                        <Button variant="contained" sx={{marginTop: "2.5%", backgroundColor: '#cc0000' }} onClick={registerHandler}>Register</Button>
                        <Typography variant="subtitle2" component="h6" sx={{color: "black", marginTop: "1%"}}>
                            Dengan mendaftar, saya setuju dengan <br />
                            <span onClick={handleOpen} style={{cursor: "pointer", color: "blueviolet", textDecoration: "underline"}}>
                                Syarat & Ketentuan dan Kebijakan
                            </span>
                        </Typography>
                    </Box>
                </Item>
            </Grid>
            <Grid size={6}>
                <Item>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            draggable={false}
                            src={LoginPageImage}
                            alt="Example"
                            // layout="responsive"
                            width={0}
                            height={400}
                        />
                        <Typography variant="h6" component="h6" sx={{color: "black"}}>
                            Jual beli murah hanya di Diamond Electronic
                        </Typography>
                        <Typography variant="overline" component="h6" sx={{color: "black"}}>
                            Gabung dan rasakan kemudahan bertransaksi di Diamond Electronic
                        </Typography>
                    </Box>
                </Item>
            </Grid>
        </Grid>
        <Footer />
    </Box>
  );
}