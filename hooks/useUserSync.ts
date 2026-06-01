import { useSupabase } from "@/lib/useSupabase";
import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";

export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const authSupabse = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);

  const syncUser = async () => {
    const { data, error } = await authSupabse
      .from("users")
      .upsert(
        {
          clerk_id: user!.id,
          email: user!.primaryEmailAddress?.emailAddress,
          first_name: user!.firstName,
          last_name: user!.lastName,
          avatar_url: user!.imageUrl,
        },
        { onConflict: "clerk_id", ignoreDuplicates: false }
      )
      .select("is_admin")
      .single();

    if (error) {
      console.error("Failed to sync user", error);
      return;
    }
    setIsAdmin(data?.is_admin ?? false);
  };};
