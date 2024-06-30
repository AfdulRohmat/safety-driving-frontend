import { ColumnDef } from "@tanstack/react-table";

export type Monitoring = {
    id: number,
    perclos: string,
    // pebr: string,
    // nYawn: string,
    // kondisiKantuk: string,
    tripToken: string,
}

export const monitoringFaceColumns: ColumnDef<Monitoring>[] = [
    {
        header: 'No.',
        accessorFn: (_row, i) => i + 1, // Index column
        id: 'index',
    },
    {
        header: 'Nilai Perclos',
        accessorFn: (row) => row.perclos,
        id: 'perclos',
    },
    // {
    //     header: 'Nilai Pebr',
    //     accessorFn: (row) => row.pebr,
    //     id: 'pebr',
    // },
    // {
    //     header: 'Nilai N-Yawn',
    //     accessorFn: (row) => row.nYawn,
    //     id: 'nYawn',
    // },
    // {
    //     header: 'Kondisi Kantuk',
    //     accessorFn: (row) => row.kondisiKantuk,
    //     id: 'levelKantuk',
    // },

];