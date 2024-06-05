import { ColumnDef } from "@tanstack/react-table";


export type Monitoring = {
    id: number,
    latitude: string,
    longitude: string,
    kecepatan: string,
    levelKantuk: string,
    tripToken: string,
}

export const monitoringColumns: ColumnDef<Monitoring>[] = [
    {
        header: 'No.',
        accessorFn: (_row, i) => i + 1, // Index column
        id: 'index',
    },
    {
        header: 'Latitude',
        accessorFn: (row) => row.latitude,
        id: 'latitude',
    },
    {
        header: 'Longitude',
        accessorFn: (row) => row.longitude,
        id: 'longitude',
    },
    {
        header: 'Kecepatan',
        accessorFn: (row) => row.kecepatan,
        id: 'kecepatan',
    },
    {
        header: 'Level Kantuk',
        accessorFn: (row) => row.levelKantuk,
        id: 'levelKantuk',
    },

];