import { loadStripe } from "@stripe/stripe-js";

const private_key = 'pk_test_51Is8EHB8KgDtbf5m5HSPNMOfdVaxSWchoqesXGJX6GLSvrT6uCx8x7Hu4qM8pXqeJkUSMcExddZ6IYYbc7OcQwms006J1cjLwW'

const stripePromise = loadStripe(private_key)

export default stripePromise