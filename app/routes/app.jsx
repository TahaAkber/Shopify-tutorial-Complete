import {
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
  useParams,
} from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  const { id } = useParams(); // 🔥 Get the id from the URL params

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <ui-nav-menu>
          <a href="/" rel="home">
            Home
          </a>
          <a href="/templates">Templates</a>
          <a href="/settings">Settings</a>
          {id && <a href={`/qrcodes/${id}`}>QRCodes</a>}{" "}
          {/* Ensure id exists */}
        </ui-nav-menu>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
