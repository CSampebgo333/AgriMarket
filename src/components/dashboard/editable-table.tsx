"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Pencil, Save, X } from 'lucide-react'
import { motion } from "framer-motion"

interface EditableTableProps {
  columns: {
    key: string
    title: string
    type?: "text" | "number" | "select" | "date"
    options?: { value: string; label: string }[]
    editable?: boolean
  }[]
  data: Record<string, any>[]
  onSave?: (index: number, updatedData: Record<string, any>) => void
}

export function EditableTable({ columns, data, onSave }: EditableTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<Record<string, any>>({})

  const handleEdit = (index: number) => {
    setEditingRow(index)
    setEditedData(data[index])
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const handleSave = (index: number) => {
    if (onSave) {
      onSave(index, editedData)
    }
    setEditingRow(null)
    setEditedData({})
  }

  const handleChange = (key: string, value: any) => {
    setEditedData((prev) => ({ ...prev, [key]: value }))
  }

  const renderCell = (column: EditableTableProps["columns"][0], rowData: Record<string, any>, rowIndex: number) => {
    const isEditing = editingRow === rowIndex && column.editable !== false

    if (!isEditing) {
      return rowData[column.key]
    }

    switch (column.type) {
      case "select":
        return (
          <Select
            value={editedData[column.key] || ""}
            onValueChange={(value) => handleChange(column.key, value)}
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
            value={editedData[column.key] || ""}
            onChange={(e) => handleChange(column.key, e.target.value)}
            className="h-8 w-full"
          />
        )
      case "date":
        return (
          <Input
            type="date"
            value={editedData[column.key] || ""}
            onChange={(e) => handleChange(column.key, e.target.value)}
            className="h-8 w-full"
          />
        )
      default:
        return (
          <Input
            type="text"
            value={editedData[column.key] || ""}
            onChange={(e) => handleChange(column.key, e.target.value)}
            className="h-8 w-full"
          />
        )
    }
  }

  return (
    <div className="rounded-md border bg-white dark:bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`${rowIndex % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/30 dark:bg-muted/10"}`}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>{renderCell(column, row, rowIndex)}</TableCell>
              ))}
              <TableCell>
                {editingRow === rowIndex ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(rowIndex)}
                      className="h-8 w-8 cursor-pointer"
                    >
                      <Save className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="h-8 w-8 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(rowIndex)}
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
