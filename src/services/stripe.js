import { loadStripe } from "@stripe/stripe-js";

const private_key = 'pk_live_51Is8EHB8KgDtbf5mxV5poKZxIlJnNWcAMm2WgPreUyiTGeHZ0lw66BfR46HZguigcipMEcXYSew6UFulHk0BQIYH00X1LrJ2lF'

const stripePromise = loadStripe(private_key)

export default stripePromise