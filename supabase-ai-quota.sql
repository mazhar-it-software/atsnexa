-- ATSNexa atomic daily AI usage reservation and refund.
-- Execute once in the Supabase SQL Editor. Existing rows are retained.
-- These functions are intended for server-side service_role calls only.

CREATE OR REPLACE FUNCTION public.reserve_ai_generation(p_user_id uuid, p_day date, p_limit integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_count integer;
BEGIN
  IF p_user_id IS NULL OR p_day IS NULL OR p_limit < 1 OR p_limit > 1000 THEN
    RAISE EXCEPTION 'Invalid quota reservation';
  END IF;
  INSERT INTO public.ai_usage(user_id, day, count)
  VALUES (p_user_id, p_day, 0)
  ON CONFLICT (user_id, day) DO NOTHING;
  SELECT count INTO v_count
    FROM public.ai_usage
    WHERE user_id = p_user_id AND day = p_day
    FOR UPDATE;
  IF v_count >= p_limit THEN RETURN false; END IF;
  UPDATE public.ai_usage
     SET count = count + 1
   WHERE user_id = p_user_id AND day = p_day;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_ai_generation(p_user_id uuid, p_day date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.ai_usage
     SET count = GREATEST(0, count - 1)
   WHERE user_id = p_user_id AND day = p_day;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_ai_generation(uuid,date,integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_ai_generation(uuid,date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_generation(uuid,date,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_ai_generation(uuid,date) TO service_role;
