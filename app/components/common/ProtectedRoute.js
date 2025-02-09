"use client";

import { useAuth } from "../../components/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../common/loading/loading";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (requireAdmin && userRole !== "ADMIN")) {
        router.push("/");
      }
    }
  }, [user, userRole, loading, router, requireAdmin]);

  if (loading) {
    return <Loading />;
  }

  if (user && (!requireAdmin || (requireAdmin && userRole === "ADMIN"))) {
    return children;
  }

  return <Loading />;
}
