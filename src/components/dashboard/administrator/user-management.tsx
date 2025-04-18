import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/utils/utils"

// Sample user data
const users = [
  {
    id: "USR-001",
    name: "Amadou Diallo",
    email: "amadou@example.com",
    role: "customer",
    status: "active",
    country: "Mali",
    joinDate: new Date(2023, 2, 15),
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "USR-002",
    name: "Fatima Ouedraogo",
    email: "fatima@example.com",
    role: "seller",
    status: "active",
    country: "Burkina Faso",
    joinDate: new Date(2023, 3, 10),
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "USR-003",
    name: "Ibrahim Maiga",
    email: "ibrahim@example.com",
    role: "logistician",
    status: "active",
    country: "Niger",
    joinDate: new Date(2023, 3, 22),
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "USR-004",
    name: "Aisha Toure",
    email: "aisha@example.com",
    role: "customer",
    status: "inactive",
    country: "Mali",
    joinDate: new Date(2023, 4, 5),
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const roleStyles = {
  customer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  seller: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  logistician: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  administrator: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function UserManagement() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={roleStyles[user.role as keyof typeof roleStyles]}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={statusStyles[user.status as keyof typeof statusStyles]}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.country}</TableCell>
            <TableCell>{formatDate(user.joinDate)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}