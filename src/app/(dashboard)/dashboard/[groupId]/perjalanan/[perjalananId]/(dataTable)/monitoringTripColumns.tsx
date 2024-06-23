import { ColumnDef } from "@tanstack/react-table";

export type Monitoring = {
    id: number,
    heartRate: string,
    posisiPedalGas: string,
    latitude: string,
    longitude: string,
    rpm: string,
    kondisiKantuk: string,
    tripToken: string,
    createdAt: Date,
}

export const monitoringTripColumns = (): ColumnDef<Monitoring>[] => [

    {
        header: 'No.',
        accessorFn: (_row, i) => i + 1, // Index column
        id: 'index',
    },
    {
        header: 'Heart Rate',
        accessorFn: (row) => row.heartRate,
        id: 'heartRate',
    },
    {
        header: 'Posisi Pedal Gas',
        accessorFn: (row) => row.posisiPedalGas,
        id: 'posisiPedalGas',
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
        header: 'Kecepatan (RPM)',
        accessorFn: (row) => row.rpm,
        id: 'rpm',
    },
    {
        header: 'Kondisi Kantuk',
        accessorFn: (row) => row.kondisiKantuk,
        id: 'levelKantuk',
    },
    {
        header: 'Diambil Pada',
        accessorFn: (row) => {
            const dateString = row.createdAt
            function formatDateToJakartaManual(dateString: any) {
                const date = new Date(dateString);

                // Jakarta is UTC+7
                const offset = 7 * 60; // Offset in minutes
                const localTime = date.getTime() + (offset * 60 * 1000);
                const jakartaDate = new Date(localTime);

                const year = jakartaDate.getUTCFullYear();
                const month = String(jakartaDate.getUTCMonth() + 1).padStart(2, '0');
                const day = String(jakartaDate.getUTCDate()).padStart(2, '0');

                const hours = String(jakartaDate.getUTCHours()).padStart(2, '0');
                const minutes = String(jakartaDate.getUTCMinutes()).padStart(2, '0');
                const seconds = String(jakartaDate.getUTCSeconds()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} WIB`;
            }

            return formatDateToJakartaManual(dateString);
        },
        id: 'createdAt',
    },

];