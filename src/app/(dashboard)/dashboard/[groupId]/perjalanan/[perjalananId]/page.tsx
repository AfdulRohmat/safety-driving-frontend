'use client'
import { Button } from "@/components/ui/button"
import React, { useEffect, useRef, useState } from 'react';
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
    MarkerF,
} from '@react-google-maps/api'
import { useSSE } from '../(hooks)/useSSE';
import { useParams } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { MonitoringTable } from './(dataTable)/monitoringTable';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { monitoringColumns } from "./(dataTable)/monitoringColumns";
import { fetchApi } from "@/utils/api";

export default function DetailPerjalanan() {
    const [map, setMap] = useState<any>(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [centerPosition, setCenterPosition] = useState({
        lat: -7.285066181776727, lng: 112.79615733299998
    })
    const [monitoringPosition, setMonitoringPosition] = useState(
        { lat: -7.285066181776727, lng: 112.79615733299998 }
    )
    const [detailTrip, setDetailTrip] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const params = useParams()

    const originRef: any = useRef()
    const destiantionRef: any = useRef()

    const dataMonitoring = useSSE(`${process.env.NEXT_PUBLIC_API_URL}/trips/monitoring-trip?tripToken=${params.perjalananId}`);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: ['places'],
    })

    async function calculateRoute() {
        if (loading) {
            return
        }
        // if (originRef.current.value === '' || destiantionRef.current.value === '') {
        //     return
        // }

        const directionsService = new google.maps.DirectionsService()
        // const results: any = await directionsService.route({
        //     origin: originRef.current.value,
        //     destination: destiantionRef.current.value,
        //     travelMode: google.maps.TravelMode.DRIVING,
        // })
        const results: any = await directionsService.route({
            origin: { lat: centerPosition.lat, lng: centerPosition.lng },
            destination: { lat: detailTrip.latitudeTujuan, lng: detailTrip.longitudeTujuan },
            travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destiantionRef.current.value = ''
    }

    function doEndMonitoring() {
        dataMonitoring.closeConnection();

        // API UNTUK MENGUBAH STATUS PERJALANAN MENJADI SELESAI


        toast({
            title: "Perjalanan Berakhir",
            description: "Proses monitoring berakhir, tunggu beberapa saat untuk mendapatkan laporan perjalanan"
        })
    }

    async function getDetailTrip() {
        // params.perjalananId
        setLoading(true);
        const { data } = await fetchApi(`trips/detail?tripToken=${params.perjalananId}`, {
            method: "GET",
        })
        if (data) {
            setDetailTrip(data);
            setCenterPosition({
                lat: data.latitudeAwal,
                lng: data.longitudeAwal
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        // var start = new google.maps.LatLng(-7.285066181776727, 112.79615733299998);
        // var end = new google.maps.LatLng(-7.290297579546484, 112.79637586595679);
        getDetailTrip()
        // calculateRoute();

    }, []);

    useEffect(() => {
        if (dataMonitoring.data.length !== 0) {
            const recentPosition = dataMonitoring.data[dataMonitoring.data.length - 1]
            console.log({
                lat: parseFloat(recentPosition.latitude),
                lng: parseFloat(recentPosition.longitude)
            })

            setMonitoringPosition({
                lat: parseFloat(recentPosition.latitude),
                lng: parseFloat(recentPosition.longitude)
            })
        }

    }, [dataMonitoring.data])

    useEffect(() => {
        if (map) {
            map.panTo(monitoringPosition);
        }
    }, [monitoringPosition, map]);


    if (loading) {
        return <div><p>loading</p></div>
    }

    if (!isLoaded) {
        return <div><p>Maps is not loaded !</p></div>
    }

    return (
        <div className="container flex flex-col gap-6 py-4 h-screen">
            {/* Nama Menu */}
            <div className='flex justify-between'>
                <h1 className="text-xl font-semibold">Monitoring Perjalanan</h1>
                {dataMonitoring.isClose ? <div className="text-red-500">Perjalanan Sudah Diakhiri. Proses Monitoring Berhenti</div> : (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-600">Akhiri Perjalanan</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah anda yakin untuk mengakhiri perjalanan?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Ketika perjalanan diakhir, proses monitoring akan dihentikan sepenuhnya. Anda tidak bisa lagi memantau driver anda
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => doEndMonitoring()}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Informasi Token */}
            <div className="flex gap-2 items-center">
                <div>Token Perjalanan : </div>
                <div className="p-2 border border-green-500 bg-green-100 rounded-md text-lg font-semibold text-slate-800">{params.perjalananId}</div>
            </div>
            <div className="text-sm font-light p-2 border border-green-500 bg-green-100 rounded-md ">
                Token diatas telah dikirimkan ke nomor whatsapp driver yang terdaftar. Gunakan token diatas untuk mendaftarkan perjalanan ke dalam device
            </div>

            {/* Row Maps dan Data Table */}
            <div className='flex flex-col gap-4'>
                {/* maps */}
                <div className='h-[400px]'>
                    <GoogleMap
                        center={centerPosition}
                        zoom={15}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        options={{
                            zoomControl: true,
                            streetViewControl: true,
                            mapTypeControl: true,
                            fullscreenControl: true,
                        }}
                        onLoad={map => setMap(map)}
                    >
                        <Marker position={centerPosition} />
                        <Marker position={monitoringPosition} />

                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                    </GoogleMap>
                </div>

                {/* Data Table */}
                <MonitoringTable columns={monitoringColumns} data={dataMonitoring.data} />

            </div>

        </div>
    )
}
