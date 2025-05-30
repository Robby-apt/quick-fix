"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ServiceFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

const serviceCategories = [
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "roofing",
  "hvac",
  "landscaping",
  "cleaning",
  "appliance-repair",
  "handyman",
]

export function ServiceForm({ initialData, onSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    priceType: initialData?.price_type || "hourly",
    basePrice: initialData?.base_price?.toString() || "",
    isActive: initialData?.is_active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required"
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Service description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    if (!formData.category) {
      newErrors.category = "Service category is required"
    }

    if (!formData.basePrice.trim()) {
      newErrors.basePrice = "Price is required"
    } else {
      const price = Number.parseFloat(formData.basePrice)
      if (isNaN(price) || price <= 0) {
        newErrors.basePrice = "Price must be a positive number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priceType: formData.priceType,
        basePrice: Number.parseFloat(formData.basePrice),
        isActive: formData.isActive,
      })
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Service Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="e.g., Professional Plumbing Repair"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Service Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            placeholder="Describe your service in detail. What do you offer? What's included?"
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Service Category *</Label>
          <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <Label>Pricing Type *</Label>
          <RadioGroup
            value={formData.priceType}
            onValueChange={(value) => updateFormData("priceType", value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="hourly" />
              <Label htmlFor="hourly">Hourly Rate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Price</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="basePrice">{formData.priceType === "hourly" ? "Hourly Rate" : "Fixed Price"} ($) *</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.basePrice}
            onChange={(e) => updateFormData("basePrice", e.target.value)}
            placeholder={formData.priceType === "hourly" ? "e.g., 75.00" : "e.g., 150.00"}
            className={errors.basePrice ? "border-red-500" : ""}
          />
          {errors.basePrice && (
            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.basePrice}
            </p>
          )}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Service Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? "Service is active and visible to clients"
                    : "Service is inactive and hidden from clients"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateFormData("isActive", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  )
}
