import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { memo, useCallback, useEffect, useState, } from "react"
import { Api } from "@/app/_api/apiCall";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


function Home({ Props }: { Props: any }) {
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [finalPrice, setFinalPrice] = useState(Props.price)

  const [{ options }, dispatch] = usePayPalScriptReducer();

  const router = useRouter()

  const buttonCall = () => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        intent: "subscription",
      },
    });
  }





  const applyCouponCode = () => {
    Api('payment/applyCouponCode', { coupon_code: couponCode, plan_id: Props.planId }).then((data) => {
      if (data.status_code == 201) {
        toast.error('Invalid coupon code')
      } else {
        toast.success('Coupon code apply')
        setDiscount(data.data.discount_price)
        setFinalPrice(data.data.final_price)
        buttonCall()
      }
    })
  }

  return (<>

    <div className="col-md-5">
      <div className="card paymentBox">
        {Props.planName == 'pro' &&
          <div className="border-innerBox">
            <div className="d-flex justify-content-between gap-3">
              <div className="custom-input without-labelInput">
                <input type="text" placeholder="Discount Coupon" className="form-control" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              </div>

              <button type="button" className="custom-btn" onClick={applyCouponCode} disabled={!couponCode}>Apply</button>
            </div>
          </div>}

        <div className="border-innerBox pt-16">
          <div className="d-flex justify-content-between">
            <p className="mb-1">Plan Price</p>

            <p className="mb-1">US$ {Props.price}</p>
          </div>

          <div className="d-flex justify-content-between">
            <p className="mb-0">Discount:</p>

            <p className="mb-0">US$ {discount}</p>
          </div>
        </div>

        <div className="border-innerBox pt-16">
          <div className="d-flex justify-content-between">
            <h5 className="Text--headingMd text-subbed">Final Price</h5>

            <h5 className="Text--headingMd">US$ {finalPrice}</h5>
          </div>

          <div className="full-btn mt-2">

            <PayPalButtons
              createSubscription={(data, actions) => {
                Api('payment/paymentTriedMail', { plan_name: Props.planName })
                return actions.subscription
                  .create({
                    plan_id: Props.paypalPlanId,
                    plan: {
                      billing_cycles: [{
                        sequence: 1,
                        total_cycles: 0,
                        pricing_scheme: { fixed_price: { value: finalPrice, currency_code: "USD" } }
                      }]
                    },
                  })
                  .then((subscriptionId) => {
                    Api('payment/saveSubscriptionId', { subscription_id: subscriptionId, plan_name: Props.planName, proplan_id: Props.planId })
                    return subscriptionId;
                  });
              }}
              onApprove={async () => {
                router.push('/dashboard?showPaymentModal=true')
              }}
              onCancel={() => {
                router.push('/dashboard?showPaymentModal=true')
              }}
              style={{
                shape: "pill",
                color: "blue",
                layout: "vertical",
                label: "subscribe"
              }}
            />

          </div>
        </div>
      </div>
    </div>
  </>)
}


export default memo(Home)