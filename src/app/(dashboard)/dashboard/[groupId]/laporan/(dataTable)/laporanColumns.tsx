"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, Download } from "lucide-react"
import React, { useState } from 'react'
import { Perjalanan } from '../../perjalanan/(dataTable)/perjalananColumns'
import { useRouter } from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from 'js-cookie';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const rolesCanDownload = [
  'ROLE_ADMIN_GROUP',
  'ROLE_COMPANY',
  'ROLE_MEDIC',
  'ROLE_KNKT',
]

export const laporanColumns = (userJoinedGrup: any): ColumnDef<Perjalanan>[] => [
  {
    header: 'No.',
    accessorFn: (_row, i) => i + 1, // Index column
    id: 'index',
  },
  {
    header: 'Driver',
    accessorFn: (row) => row.driver.username,
    id: 'username',
  },
  {
    header: 'Jadwal Perjalanan',
    accessorFn: (row) => formatDate(row.jadwalPerjalanan),
    id: 'jadwalPerjalanan',
  },
  {
    header: 'Alamat Awal',
    accessorFn: (row) => row.alamatAwal,
    id: 'alamatAwal',
  },
  {
    header: 'Alamat Tujuan',
    accessorFn: (row) => row.alamatTujuan,
    id: 'alamatTujuan',
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    id: 'status',
  },
  {
    id: "tripToken",
    accessorKey: "tripToken",
    header: 'Action',
    cell: ({ row }) => {

      const downloadFileLaporan = async () => {
        const token = Cookies.get('token');

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips/export-data-trip?tripToken=${row.getValue("tripToken")}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              Authorization: `Bearer ${token}`
            },

          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `laporan-perjalanan-tanggal-${row.getValue("jadwalPerjalanan")}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (error) {
          console.error('Error downloading the file', error);
        }
      };

      return (
        <div>
          {
            rolesCanDownload.includes(userJoinedGrup.role) ? <div className="hover:cursor-pointer" onClick={() => downloadFileLaporan()}>
              <Download />
            </div> : <div></div>
          }

        </div>

      )
    },
  },
]