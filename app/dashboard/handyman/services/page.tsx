"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import HandymanDashboardLayout from "@/components/layouts/handyman-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useServices } from "@/lib/hooks/useServices"
import { useState } from "react"
import { ServiceForm } from "@/components/forms/service-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export default function HandymanServicesPage() {
  const { user } = useAuth()
  const { services, loading, createService, refetch } = useServices({ handyman: user?.profile.id })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [deletingService, setDeletingService] = useState<string | null>(null)

  const handleCreateService = async (data: any) => {
    try {
      await createService(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create service:", error)
    }
  }

  const handleEditService = async (data: any) => {
    try {
      // TODO: Implement edit service API call
      console.log("Edit service:", data)
      setEditingService(null)
      await refetch()
    } catch (error) {
      console.error("Failed to edit service:", error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      // TODO: Implement delete service API call
      console.log("Delete service:", serviceId)
      setDeletingService(null)
      await refetch()
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  if (!user) {
    return (
      <HandymanDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-muted-foreground">You need to be logged in to manage your services.</p>
          </div>
        </div>
      </HandymanDashboardLayout>
    )
  }

  return (
    <HandymanDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Services</h1>
            <p className="text-muted-foreground">Manage the services you offer to clients</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>Add a new service that you offer to clients.</DialogDescription>
              </DialogHeader>
              <ServiceForm onSubmit={handleCreateService} onCancel={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg line-clamp-2">{service.title}</h3>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {service.category}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{service.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-bold text-primary">
                      ${service.base_price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{service.price_type === "hourly" ? "hour" : "job"}
                      </span>
                    </div>
                    <Badge variant={service.is_active ? "default" : "secondary"}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    <Dialog
                      open={editingService?.id === service.id}
                      onOpenChange={(open) => !open && setEditingService(null)}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                          <DialogDescription>Update your service details.</DialogDescription>
                        </DialogHeader>
                        <ServiceForm
                          initialData={editingService}
                          onSubmit={handleEditService}
                          onCancel={() => setEditingService(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog
                      open={deletingService === service.id}
                      onOpenChange={(open) => !open && setDeletingService(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setDeletingService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{service.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-6">Start by creating your first service to attract clients.</p>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Service</DialogTitle>
                      <DialogDescription>Add a new service that you offer to clients.</DialogDescription>
                    </DialogHeader>
                    <ServiceForm onSubmit={handleCreateService} onCancel={() => setIsCreateDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </HandymanDashboardLayout>
  )
}
