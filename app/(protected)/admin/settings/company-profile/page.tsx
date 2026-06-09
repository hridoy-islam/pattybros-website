"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Camera, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  Save, 
  Loader2,
  Upload,
  User,
  Shield,
  BadgeCheck,
  ChevronRight,
  Settings,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { ImageUploader } from "@/components/profile/userImage-uploader";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";





interface FormValues {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  image: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function CompanyProfilePage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth) || { user: null };
    const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      website: "",
      image: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { register, handleSubmit, watch, setValue, reset } = form;
  const currentImageUrl = watch("image");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?._id) return;
      setIsLoadingProfile(true);
      try {
        const response = await axiosInstance.get(`/users/${user._id}`);
        const profileData = response.data?.data;
        
        if (profileData) {
          reset({
            companyName: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            website: profileData.website || "",
            image: profileData.image || "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error: any) {
        console.error("Fetch profile error:", error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error?.response?.data?.message || "Could not retrieve your company profile data.",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [user?._id, reset, toast]);

  const handleUploadComplete = (data: any) => {
    setUploadOpen(false);
    if (data?.url || data?.fileUrl || data?.data?.fileUrl) {
      const url = data?.url || data?.fileUrl || data?.data?.fileUrl;
      setValue("image", url, { shouldValidate: true });
    }
  };

  const onUpdateProfile = async (values: FormValues) => {
    if (!user?._id) return;
    setIsSavingProfile(true);
    try {
      const profilePayload = {
        name: values.companyName,
        phone: values.phone,
        website: values.website,
        image: values.image,
      };

      await axiosInstance.patch(`/users/${user._id}`, profilePayload);
      
      toast({
        title: "Profile Updated Successfully",
        description: "Your company information has been saved.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onUpdatePassword = async (values: FormValues) => {
    if (!user?._id) return;
    if (!values.newPassword || !values.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out both password fields.",
      });
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
      });
      return;
    }
    if (values.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await axiosInstance.patch(`/users/${user._id}`, {
        password: values.newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your security credentials have been updated successfully.",
      });
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Loading Profile</p>
          <p className="text-sm text-gray-500 mt-1">Fetching your company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto space-y-8 ">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold  mb-2">Company Settings</h1>
            <p className=" text-sm">Manage your business profile and security preferences</p>
          </div>

          <Button onClick={()=> router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />Back

          </Button>
          
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'profile' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4" />
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'security' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4" />
          Security Settings
        </button>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Logo Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <BadgeCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Company Logo</h3>
              </div>
              
              <div className="relative group mb-6">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 group-hover:border-blue-300 transition-all duration-300">
                  <img
                    src={currentImageUrl || 'https://kzmjkvje8tr2ra724fhh.lite.vusercontent.net/placeholder.svg'}
                    alt="Company Logo"
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white text-white hover:bg-white/20"
                      onClick={() => setUploadOpen(true)}
                    >
                      <Upload className="h-4 w-4" />
                      Change Logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Logo Requirements</p>
                    <p>Recommended size: 400x400px. Supported formats: PNG, JPG, SVG. Maximum file size: 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">General Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company Name
                    </label>
                    <Input 
                      {...register("companyName")} 
                      placeholder="Acme Logistics Ltd"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      {...register("email")} 
                      disabled 
                      placeholder="contact@acme.com"
                    />
                    <p className="text-xs text-gray-400">Contact support to change your email address</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <Input 
                      type="tel" 
                      {...register("phone")} 
                      placeholder="+1 (555) 234-5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Website URL
                    </label>
                    <Input 
                      type="url" 
                      {...register("website")} 
                      placeholder="https://acme.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <Button 
                    type="submit" 
                    disabled={isSavingProfile}
                    size="lg"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab Content */}
      {activeTab === 'security' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit(onUpdatePassword)} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Change Password</h3>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold mb-1">Password Requirements</p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Include numbers and special characters
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Don't use common or previously used passwords
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    New Password
                  </label>
                  <Input 
                    type="password" 
                    {...register("newPassword")} 
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <Input 
                    type="password" 
                    {...register("confirmPassword")} 
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button 
                  type="submit" 
                  disabled={isSavingPassword}
                  size="lg"
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageUploader
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
        entityId={user?._id || "new-menu-item"}
      />
    </div>
  );
}