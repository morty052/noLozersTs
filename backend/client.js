import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
    token:"skN1bdo2ohBMIwZSjLOsgXeMe9YFwyBWUUZkMoS9EbxVOUgTFBPqfUYdhUJjGPPTTTBYuMaFV7zjKCJZJyWhnSLb5GlBXJwBuCdGNLcrd2JDZMCxSdKViPFuD2eRLX5rSfEDkCepM7uSUX6jwPUtQlf51YG8rbDF4Pqfq9RB6VOw9Cu0ynhY",
    useCdn:false,
    projectId:"o543jo9z",
    dataset:'production',
    apiVersion:'2023-05-03'
    
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}



export default client