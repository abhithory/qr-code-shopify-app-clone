import { useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useSessionToken,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => (
  <Extension />
));

function Extension() {
  const { shop } = useExtensionApi();
  const [data, setData] = useState();

  const sessionToken = useSessionToken();


  useEffect( async () => {
    const getProductsQuery = {
      query: `query {
        inventoryItem(id: "gid://shopify/InventoryItem/19848949301270") {
          id
          inventoryLevels(first: 10) {
            edges {
              node {
                available
              }
            }
          }
        }
      }`,
      variables: { first: 5 },
    };

    const getBrandQuery = {
      query: `query {
        shop {
          name
          primaryDomain {
            url
            host
          }
        }
      }`
    }

    const getDiscountCopons = {
      query: `query ($first: Int!) {
        codeDiscountNodes (first: $first) {
          edges {
            node {
              id
              codeDiscount {
                __typename
              }
            }
          }
        }
      }`,
      variables: { first: 5 }
    }

    const generateToken = {
      query: `mutation {
        discountCodeBasicCreate(basicCodeDiscount: {
          title: "Code discount basic test",
          startsAt: "2023-02-21",
          endsAt: "2023-11-11",
          usageLimit: 1,
          appliesOncePerCustomer: true,
          customerSelection: {
            all: true
          }
          code: "TESTCODEMYTEST",
          customerGets: {
            value: {
              discountAmount:  {
                amount: 100.00,
                appliesOnEachItem: true
              }
            }
            
          }}) {
          userErrors { field message code }
          codeDiscountNode {
            id
              codeDiscount {
              ... on DiscountCodeBasic {
                title
                summary
                status
                codes (first:10) {
                  edges {
                    node {
                      code
                    }
                  }
                }
              }
            }
          }
        }
      }
      `
    }

    const apiVersion = 'unstable';

    const access_token = await sessionToken.get();

    console.log(access_token);

    fetch(
      `${shop.storefrontUrl}admin/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${access_token}`
        },
        body: JSON.stringify(getDiscountCopons),
      },
    )
      .then((response) => {
        console.log('=============response== =====================');
        console.warn(response.body)
        console.log(response);
        console.log('====================================');
        return response.json()
      })
      .then(({ data, errors }) => {
        console.log('=============data=======================');
        console.log(data);
        console.log('====================================');
        console.log('=================errors===================');
        console.log(errors);
        console.log('====================================');
        setData(data)});
  }, [shop]);

  return (
    <Banner title="qr-code-checkout-ui">
      "welcome disount afdsfs"
    </Banner>
  );
}
