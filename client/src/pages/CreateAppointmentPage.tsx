import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function CreateAppointmentPage() {
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "4",
    description: "",
    type: "meal" // meal, activity, other
  });

  const handleSubmit = () => {
    // In a real app, this would submit to backend
    // For now, we just navigate back to profile or show success
    setLocation("/profile");
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 pt-safe pb-3 sticky top-0 z-10 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">发起预约</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Activity Type */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">活动类型</h3>
            <div className="flex gap-3">
              {[
                { id: "meal", label: "约饭", icon: "🍽️" },
                { id: "activity", label: "活动", icon: "🏸" },
                { id: "other", label: "其他", icon: "✨" }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={cn(
                    "flex-1 py-3 rounded-lg text-sm font-medium transition-all border-2",
                    formData.type === type.id 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-transparent bg-slate-50 text-slate-600"
                  )}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-slate-50">
            <div className="p-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">活动主题</label>
              <Input 
                placeholder="例如：周末三里屯探店" 
                className="border-none bg-slate-50 h-11"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">日期</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="date"
                    className="border-none bg-slate-50 h-11 pl-9"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">时间</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="time"
                    className="border-none bg-slate-50 h-11 pl-9"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">地点</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="选择或输入活动地点" 
                  className="border-none bg-slate-50 h-11 pl-9"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
            </div>

            <div className="p-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">人数限制</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="number"
                  placeholder="最大参与人数" 
                  className="border-none bg-slate-50 h-11 pl-9"
                  value={formData.maxParticipants}
                  onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">活动详情</label>
            <Textarea 
              placeholder="介绍一下活动内容，吸引更多小伙伴参加..." 
              className="border-none bg-slate-50 min-h-[120px] resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Bottom Action */}
        <div className="bg-white border-t border-slate-100 p-4 pb-safe sticky bottom-0">
          <Button 
            className="w-full h-12 rounded-full bg-slate-900 text-white font-bold text-lg shadow-lg shadow-slate-200 active:scale-[0.98] transition-transform"
            onClick={handleSubmit}
          >
            发布预约
          </Button>
        </div>
      </div>
    </Layout>
  );
}
