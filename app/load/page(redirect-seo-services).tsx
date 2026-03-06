"use client";

import Dashboard from "../(bigcommerce)/dashboard/page";
import Loading from "../_components/loading";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Api } from "@/app/_api/apiCall";
import Error from "@/app/error";

import Layout from "../(bigcommerce)/layout";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signedPayload = searchParams?.get("signed_payload");
  const signedPayloadJwt = searchParams?.get("signed_payload_jwt");

  const [loading, setLoading] = useState(true);
  const [validUser, setValidUser] = useState(true);
  const [storeHash, setStoreHash] = useState("");
  const [redirectingToUpgrade, setRedirectingToUpgrade] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      try {
        const data: any = await Api("appLoad", {
          signedPayload,
          signedPayloadJwt,
        });

        // 🔥 Check if data exists
        if (!data || data?.status_code !== 200 || !data?.data) {
          setValidUser(false);
          setLoading(false);
          return;
        }

        const result = data.data;

        // Save data safely
        localStorage.setItem("api-token", result.api_token ?? "");
        localStorage.setItem("email", result.store_email ?? "");
        localStorage.setItem("shop", result.shop ?? "");
        localStorage.setItem("manage_service", result.manage_services ?? "");
        localStorage.setItem("user_id", result.user_id ?? "");
        localStorage.setItem("signedPayload", signedPayload ?? "");
        localStorage.setItem(
          "channel",
          JSON.stringify(result.channel_list?.[0] ?? {}),
        );

        setStoreHash(result.shop ?? "");

        // 🔥 Second API Call
        try {
          const redirectIfResponse: any = await Api("redirectIf", {
            store_id: result.user_id,
          });

          if (redirectIfResponse?.flag === 1) {
            setRedirectingToUpgrade(true);
            router.replace("/upgrade?tab=seoServices");
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error("redirectIf error:", err);
          setLoading(false);
        }
      } catch (error) {
        console.error("appLoad error:", error);
        setValidUser(false);
        setLoading(false);
      }
    };

    loadApp();
  }, [signedPayload, signedPayloadJwt, router]);

  // useEffect(() => {
  //   Api('appLoad', { signedPayload, signedPayloadJwt }).then(async (data: any) => {
  //     const isValid = data?.status_code == 200
  //     const result = data?.data
  //     setValidUser(isValid)

  //     if (!isValid) {
  //       setLoading(false)
  //       return
  //     }

  //     if (isValid && result) {
  //       localStorage.setItem('api-token', result.api_token)
  //       localStorage.setItem('email', result.store_email)
  //       localStorage.setItem('shop', result.shop)
  //       localStorage.setItem('manage_service', result.manage_services)
  //       localStorage.setItem('user_id', result.user_id)
  //       localStorage.setItem('signedPayload', signedPayload ?? '')
  //       localStorage.setItem('channel', JSON.stringify(result.channel_list?.[0] ?? {}))
  //       setStoreHash(result.shop)

  //       // Pehle redirectIf API ka response lo, phir hi Dashboard ya redirect - taaki Dashboard flash na dikhe
  //       try {
  //         const redirectIfResponse: any = await Api('redirectIf', { store_id: result.user_id })
  //         const shouldRedirectToUpgrade = redirectIfResponse?.flag === 1
  //         if (shouldRedirectToUpgrade) {
  //           setRedirectingToUpgrade(true)
  //           router.replace('/upgrade?tab=seoServices')
  //         } else {
  //           setLoading(false)
  //         }
  //       } catch (_) {
  //         setLoading(false)
  //       }
  //     } else {
  //       setLoading(false)
  //     }
  //   })
  // }, [signedPayload, signedPayloadJwt, router])

  return (
    <>
      {loading || redirectingToUpgrade ? (
        <Loading />
      ) : validUser ? (
        <Layout>
          <Dashboard />
        </Layout>
      ) : (
        <Error />
      )}
    </>
  );
}
