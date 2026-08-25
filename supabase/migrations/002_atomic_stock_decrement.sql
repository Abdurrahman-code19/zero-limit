-- Atomic stock decrement function to prevent overselling
CREATE OR REPLACE FUNCTION public.decrement_stock_atomic(
  p_table TEXT,
  p_id UUID,
  p_quantity INT
) RETURNS VOID AS $$
BEGIN
  IF p_table = 'products' THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_id AND stock_quantity >= p_quantity;
  ELSIF p_table = 'product_variants' THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_id AND stock_quantity >= p_quantity;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
