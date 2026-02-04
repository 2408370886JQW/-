import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, Phone, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StoreLoginPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sid = params.get("shop_id");
    const scene = params.get("scene");

    if (sid) {
      setShopId(sid);
      // In a real app, we would fetch shop details here
    }
    
    // If not store scene, redirect to normal home
    if (scene !== "store") {
      // setLocation("/");
    }
  }, [search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      toast({
        title: "请输入完整信息",
        description: "手机号和验证码不能为空",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Store login state and shop info in localStorage/sessionStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userPhone", phone);
      if (shopId) {
        localStorage.setItem("currentShopId", shopId);
        localStorage.setItem("entryScene", "store");
      }
      
      toast({
        title: "登录成功",
        description: "正在进入门店专属服务...",
      });

      // Redirect to store home
      setLocation(`/store/home?shop_id=${shopId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-6">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">欢迎光临</h1>
          <p className="text-slate-500">登录后可查看本店推荐套餐 + 相见玩法</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle>手机号登录</CardTitle>
            <CardDescription>自动绑定当前门店服务</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input 
                    type="tel" 
                    placeholder="请输入手机号" 
                    className="pl-10 h-12 bg-slate-50 border-slate-200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <Input 
                    type="text" 
                    placeholder="验证码" 
                    className="h-12 bg-slate-50 border-slate-200"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button type="button" variant="outline" className="h-12 px-6 font-medium text-blue-600 border-blue-200 hover:bg-blue-50">
                    获取
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "立即进入"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          点击登录即代表同意《用户服务协议》和《隐私政策》
        </p>
      </div>
    </div>
  );
}
