"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle, FileText, User, MapPin } from "lucide-react"
import AdminDashboardLayout from "@/components/layouts/admin-dashboard-layout"
import { useAuth } from "@/lib/hooks/useAuth"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"

interface VerificationRequest {
  id: string
  handyman_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  service_category: string
  experience_years: number
  bio: string
  city: string
  service_area: string
  documents: {
    license?: string
    insurance?: string
    certifications?: string[]
  }
  submitted_at: string
  status: "pending" | "approved" | "rejected"
  reviewed_by?: string
  reviewed_at?: string
  notes?: string
}

export default function AdminVerificationPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchVerificationRequests = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockRequests: VerificationRequest[] = [
          {
            id: "1",
            handyman_id: "2",
            first_name: "David",
            last_name: "Wilson",
            email: "david.wilson@example.com",
            phone: "+1 (555) 456-7890",
            service_category: "electrical",
            experience_years: 8,
            bio: "Licensed electrician providing safe and reliable electrical services for homes and businesses.",
            city: "Queens",
            service_area: "Queens, Manhattan",
            documents: {
              license: "electrical-license-2024.pdf",
              insurance: "liability-insurance.pdf",
              certifications: ["OSHA-certification.pdf", "electrical-safety-cert.pdf"],
            },
            submitted_at: "2024-03-13T10:30:00Z",
            status: "pending",
          },
          {
            id: "2",
            handyman_id: "4",
            first_name: "James",
            last_name: "Anderson",
            email: "james.anderson@example.com",
            phone: "+1 (555) 789-0123",
            service_category: "painting",
            experience_years: 6,
            bio: "Professional painter offering interior and exterior painting services with attention to detail.",
            city: "Manhattan",
            service_area: "Manhattan",
            documents: {
              license: "contractor-license.pdf",
              insurance: "general-liability.pdf",
              certifications: ["lead-safe-certification.pdf"],
            },
            submitted_at: "2024-03-12T14:15:00Z",
            status: "pending",
          },
          {
            id: "3",
            handyman_id: "5",
            first_name: "Thomas",
            last_name: "Brown",
            email: "thomas.brown@example.com",
            phone: "+1 (555) 890-1234",
            service_category: "hvac",
            experience_years: 12,
            bio: "HVAC technician specializing in installation, repair, and maintenance of heating and cooling systems.",
            city: "Brooklyn",
            service_area: "Brooklyn, Queens",
            documents: {
              license: "hvac-license.pdf",
              insurance: "professional-liability.pdf",
              certifications: ["epa-certification.pdf", "refrigerant-handling.pdf"],
            },
            submitted_at: "2024-03-10T09:45:00Z",
            status: "approved",
            reviewed_by: "admin@quickfix.com",
            reviewed_at: "2024-03-11T11:20:00Z",
            notes: "All documents verified. Professional qualifications confirmed.",
          },
          {
            id: "4",
            handyman_id: "6",
            first_name: "Mark",
            last_name: "Johnson",
            email: "mark.johnson@example.com",
            phone: "+1 (555) 901-2345",
            service_category: "roofing",
            experience_years: 3,
            bio: "Roofing contractor with experience in residential roof repairs and installations.",
            city: "Bronx",
            service_area: "Bronx",
            documents: {
              license: "roofing-license.pdf",
              insurance: "workers-comp.pdf",
            },
            submitted_at: "2024-03-09T16:30:00Z",
            status: "rejected",
            reviewed_by: "admin@quickfix.com",
            reviewed_at: "2024-03-10T10:15:00Z",
            notes: "Insufficient experience. Missing required certifications for roofing work.",
          },
        ]
        setRequests(mockRequests)
      } catch (error) {
        console.error("Failed to fetch verification requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVerificationRequests()
  }, [])

  const handleVerificationAction = async (requestId: string, action: "approve" | "reject", notes?: string) => {
    try {
      setProcessingRequest(requestId)

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (action === "approve") {
        const request = requests.find((r) => r.id === requestId)
        if (request) {
          await apiClient.verifyHandyman(request.handyman_id)
        }
      }

      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: action === "approve" ? "approved" : "rejected",
                reviewed_by: user?.email,
                reviewed_at: new Date().toISOString(),
                notes: notes || "",
              }
            : request,
        ),
      )
    } catch (error) {
      console.error(`Failed to ${action} verification request:`, error)
    } finally {
      setProcessingRequest(null)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  if (!user || user.role !== "admin") {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to view this page.</p>
          </div>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Verification Management</h1>
          <p className="text-muted-foreground">Review and approve handyman verification requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{approvedRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{rejectedRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{requests.length}</div>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-32 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <VerificationRequestCard
                    key={request.id}
                    request={request}
                    onAction={handleVerificationAction}
                    processing={processingRequest === request.id}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">All verification requests have been reviewed.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              {approvedRequests.map((request) => (
                <VerificationRequestCard key={request.id} request={request} readonly />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <VerificationRequestCard key={request.id} request={request} readonly />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  )
}

interface VerificationRequestCardProps {
  request: VerificationRequest
  onAction?: (requestId: string, action: "approve" | "reject", notes?: string) => void
  processing?: boolean
  readonly?: boolean
}

function VerificationRequestCard({
  request,
  onAction,
  processing = false,
  readonly = false,
}: VerificationRequestCardProps) {
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)

  const handleAction = (action: "approve" | "reject") => {
    if (onAction) {
      onAction(request.id, action, notes)
      setNotes("")
      setShowNotes(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {request.first_name} {request.last_name}
              <Badge
                variant={
                  request.status === "approved"
                    ? "default"
                    : request.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {request.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {request.email} • {request.phone}
            </CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            Submitted {new Date(request.submitted_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Service Information</h4>
            <div className="space-y-1 text-sm">
              <div>
                <strong>Category:</strong> <span className="capitalize">{request.service_category}</span>
              </div>
              <div>
                <strong>Experience:</strong> {request.experience_years} years
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {request.city} • {request.service_area}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Documents</h4>
            <div className="space-y-1 text-sm">
              {request.documents.license && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>License: {request.documents.license}</span>
                </div>
              )}
              {request.documents.insurance && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span>Insurance: {request.documents.insurance}</span>
                </div>
              )}
              {request.documents.certifications && request.documents.certifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <span>Certifications: {request.documents.certifications.length} files</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Bio</h4>
          <p className="text-sm text-muted-foreground">{request.bio}</p>
        </div>

        {request.status !== "pending" && request.notes && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Review Notes</h4>
            <p className="text-sm">{request.notes}</p>
            {request.reviewed_by && request.reviewed_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Reviewed by {request.reviewed_by} on {new Date(request.reviewed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {!readonly && request.status === "pending" && (
          <div className="flex gap-2 pt-4">
            <Button onClick={() => handleAction("approve")} disabled={processing} className="flex-1">
              {processing ? "Processing..." : "Approve"}
            </Button>
            <Button variant="outline" onClick={() => setShowNotes(!showNotes)} disabled={processing}>
              {showNotes ? "Cancel" : "Reject"}
            </Button>
          </div>
        )}

        {showNotes && (
          <div className="space-y-3 pt-2">
            <textarea
              placeholder="Add notes for rejection (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border rounded-md resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
                disabled={processing}
                className="flex-1"
              >
                Confirm Rejection
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNotes(false)
                  setNotes("")
                }}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
