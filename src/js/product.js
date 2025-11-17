import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function main() {
  const category = getParam("category") || "tents"; // fallback to "tents"
  const productId = getParam("product");

  await loadHeaderFooter();

  const dataSource = new ProductData(category);
  const productDetails = new ProductDetails(productId, dataSource);
  await productDetails.init();
}

main();
