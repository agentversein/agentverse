"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Header( {
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter();
  const { data: session } = useSession();
 console.log("SESSION:", session) 
  const [menuOpen, setMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  return () => window.removeEventListener("resize", checkMobile);
}, []);
  const [subscription, setSubscription] = useState({
    plan: "free",
    status: "inactive",
  });

  useEffect(() => {
    if (!session) return;

    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => setSubscription(data))
      .catch(console.error);
  }, [session]);

  const startSubscription = async () => {
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "pro",
        }),
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AgentVerse",
        description: "Pro Subscription",
        order_id: order.id,

        handler: async function (response) {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const result = await verify.json();

          if (result.success) {
            await fetch("/api/payment/activate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                plan: "pro",
              }),
            });

            alert("🎉 Pro Plan Activated Successfully!");
          } else {
            alert("❌ Payment Verification Failed");
          }
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[99999] bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">

        <div className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="AgentVerse"
    className="w-10 h-10 rounded-lg"
  />

  <div>
    <h1 className="text-xl font-bold">
      AgentVerse
    </h1>

    <p className="hidden md:block text-sm text-gray-500">
      AI Agent Marketplace
    </p>
  </div>
</div>

         <div className="flex items-center gap-3 md:hidden">

  <button
    onClick={() => setSidebarOpen(true)}
    className="text-2xl"
  >
    ☰
  </button>

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
  >
    {session?.user?.image ? (
      <img
        src={session.user.image}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-xl">👤</span>
    )}
  </button>

</div>
          {/* Desktop Menu */}
          

          {/* Desktop Right */}
         <div className="hidden md:flex items-center gap-3"> 
          
            {session ? (
              <>
              <button
  onClick={() => router.push("/settings")}
  className="p-2 rounded-lg hover:bg-gray-100 text-xl"
  title="Settings"
>
  ⚙️
</button>
               <img
  src={session.user.image}
  alt="Profile"
  onClick={() => setMenuOpen(!menuOpen)}
  className="w-10 h-10 rounded-full cursor-pointer"
/>

                <span className="font-medium max-w-[120px] truncate">
  {session.user.name}
</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    subscription.plan === "pro"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {subscription.plan.toUpperCase()}
                </span>

                <button
  onClick={startSubscription}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
>
  ⭐ Pro
</button>

               <button
  onClick={() => signOut()}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
>
  Logout
</button>
              </>
            ) : (
              <button
                onClick={() =>
                  signIn("google", {
                    prompt: "select_account",
                  })
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
        

      </header>
      {isMobile && menuOpen && (
  <div
    className="fixed top-16 right-4 bg-white rounded-xl shadow-xl p-4 w-56 z-[99999]"
  >
    {session ? (
  <>
    <div className="flex items-center gap-3 mb-4">
      <img
        src={session.user.image}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <div className="font-bold">
          {session.user.name}
        </div>
        <div className="text-sm text-gray-500">
          {subscription.plan.toUpperCase()}
        </div>
      </div>
    </div>

    <button
      onClick={() => router.push("/settings")}
      className="w-full text-left py-2"
    >
      ⚙️ Settings
    </button>

    <button
      onClick={startSubscription}
      className="w-full text-left py-2"
    >
      ⭐ Upgrade Pro
    </button>

    <button
      onClick={() => signOut()}
      className="w-full text-left py-2 text-red-600"
    >
      🚪 Logout
    </button>
  </>
) : (
  <>
    <button
      onClick={() => signIn("google")}
      className="w-full bg-blue-600 text-white py-2 rounded-lg"
    >
      🔐 Login
    </button>

    <button
      onClick={startSubscription}
      className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg"
    >
      ⭐ Upgrade Pro
    </button>
  </>
)}
     
  </div>
)}
    </>
  );
}