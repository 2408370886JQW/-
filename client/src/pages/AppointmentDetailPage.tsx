import { useEffect, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Users, Navigation, Calendar, Share2, MoreHorizontal } from "lucide-react";
import MapView from "@/components/Map";
import { cn } from "@/lib/utils";

// Mock Data - In a real app, this would come from an API or global state
const APPOINTMENTS = [
  { 
    id: 1, 
    title: "周末探店小分队", 
    time: "明天 14:00", 
    fullTime: "2026年2月3日 14:00",
    location: "三里屯太古里", 
    address: "北京市朝阳区三里屯路19号",
    coordinates: { lat: 39.9355, lng: 116.4551 },
    status: "upcoming",
    description: "听说三里屯新开了一家网红咖啡店，一起去打卡拍照吧！之后可以去逛逛街。",
    participants: [
      { id: 1, name: "Alice", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { id: 2, name: "Bob", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
      { id: 3, name: "Charlie", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
      { id: 888888, name: "我", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" }
    ]
  },
  { 
    id: 2, 
    title: "周五晚上桌游局", 
    time: "周五 19:30", 
    fullTime: "2026年2月6日 19:30",
    location: "朝阳大悦城", 
    address: "北京市朝阳区朝阳北路101号",
    coordinates: { lat: 39.9255, lng: 116.5181 },
    status: "pending",
    description: "好久没玩狼人杀了，这周五晚上组个局，大概6-8人，新手友好。",
    participants: [
      { id: 4, name: "David", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" },
      { id: 888888, name: "我", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" }
    ]
  },
];

export default function AppointmentDetailPage() {
  const [, params] = useRoute("/appointment/:id");
  const id = params?.id ? parseInt(params.id) : null;
  const appointment = APPOINTMENTS.find(a => a.id === id);
  const mapRef = useRef<google.maps.Map | null>(null);

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-slate-400 mb-4">未找到该预约信息</div>
        <Link href="/profile">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-full">返回个人中心</button>
        </Link>
      </div>
    );
  }

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Add marker for the location
    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: appointment.coordinates,
      title: appointment.location,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <Link href="/profile">
          <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
        </Link>
        <h1 className="font-bold text-lg text-slate-900">预约详情</h1>
        <button className="p-2 -mr-2 hover:bg-slate-100 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6 text-slate-900" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{appointment.title}</h2>
            <div className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-2",
              appointment.status === "upcoming" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
            )}>
              {appointment.status === "upcoming" ? "即将开始" : "待确认"}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-slate-600">
              <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">{appointment.fullTime}</div>
                <div className="text-xs text-slate-400 mt-0.5">请提前10分钟到达</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-slate-600">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">{appointment.location}</div>
                <div className="text-xs text-slate-400 mt-0.5">{appointment.address}</div>
              </div>
            </div>
          </div>

          {appointment.description && (
            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-sm text-slate-600 leading-relaxed">{appointment.description}</p>
            </div>
          )}
        </div>

        {/* Map Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="h-48 w-full relative">
            <MapView 
              className="h-full w-full"
              initialCenter={appointment.coordinates}
              initialZoom={15}
              onMapReady={handleMapReady}
            />
            <div className="absolute bottom-3 right-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg active:scale-95 transition-transform font-medium text-sm">
                <Navigation className="w-4 h-4" />
                导航前往
              </button>
            </div>
          </div>
        </div>

        {/* Participants Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              参与人 ({appointment.participants.length})
            </h3>
            <button className="text-xs text-blue-600 font-medium">邀请好友</button>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {appointment.participants.map(p => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full p-0.5 border border-slate-100 shadow-sm">
                  <img src={p.avatar} className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-xs text-slate-600 truncate w-full text-center">{p.name}</span>
              </div>
            ))}
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-active:bg-slate-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400">邀请</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3 pb-safe">
        <button className="flex-1 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl active:scale-[0.98] transition-transform">
          取消预约
        </button>
        <button className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-[0.98] transition-transform">
          联系发起人
        </button>
      </div>
    </div>
  );
}
