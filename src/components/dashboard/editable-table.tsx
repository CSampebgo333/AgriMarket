"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  Pencil, Save} from 'lucide-react'
import { motion } from "framer-motion"

interface Column {
  key: string;
  title: string;
  type?: "text" | "number" | "date" | "select";
  options?: { value: string; label: string }[];
  editable?: boolean;
}

interface EditableTableProps<T extends { [key: string]: string | number | boolean }> {
  columns: Column[];
  data: T[];
  onSave?: (index: number, updatedData: T) => void;
  onRowClick?: (rowData: T) => void;
}

export function EditableTable<T extends { [key: string]: string | number | boolean }>({ 
  columns, 
  data, 
  onSave, 
  onRowClick 
}: EditableTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const handleCellClick = (rowIndex: number, columnKey: string, value: string | number | boolean) => {
    if (columns.find(col => col.key === columnKey)?.editable) {
      setEditingCell({ rowIndex, columnKey });
      setEditedValue(typeof value === 'boolean' ? value.toString() : value.toString());
    }
  };

  const handleSave = (rowIndex: number, columnKey: string) => {
    if (onSave) {
      const updatedData = { ...data[rowIndex], [columnKey]: editedValue };
      onSave(rowIndex, updatedData as T);
    }
    setEditingCell(null);
  };

  const handleRowClick = (rowData: T) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  const renderCell = (column: Column, rowData: T, rowIndex: number) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key

    if (!isEditing) {
      return rowData[column.key]
    }

    switch (column.type) {
      case "select":
        return (
          <Select
            value={editedValue}
            onValueChange={setEditedValue}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "number":
        return (
          <Input
            type="number"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="h-8 w-full"
          />
        )
      case "date":
        return (
          <Input
            type="date"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="h-8 w-full"
          />
        )
      default:
        return (
          <Input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="h-8 w-full"
          />
        )
    }
  }

  return (
    <div className="rounded-md border bg-white dark:bg-card w-full min-w-[900px]">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="whitespace-nowrap px-3 py-2">{column.title}</TableHead>
            ))}
            <TableHead className="w-[100px] text-right px-3 py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`${rowIndex % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/30 dark:bg-muted/10"} ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className="whitespace-nowrap px-3 py-2">{renderCell(column, row, rowIndex)}</TableCell>
              ))}
              <TableCell className="text-right px-3 py-2">
                {editingCell?.rowIndex === rowIndex && editingCell?.columnKey === columns[rowIndex].key ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(rowIndex, columns[rowIndex].key);
                      }}
                      className="h-8 w-8 cursor-pointer"
                    >
                      <Save className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(rowIndex, columns[rowIndex].key, row[columns[rowIndex].key]);
                    }}
                    className="h-8 w-8 cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
