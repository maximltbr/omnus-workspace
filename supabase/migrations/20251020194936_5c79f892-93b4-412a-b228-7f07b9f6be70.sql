-- Create datasets table
CREATE TABLE public.datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  source text NOT NULL,
  type text NOT NULL,
  automation_enabled boolean NOT NULL DEFAULT false,
  automation_status text NOT NULL DEFAULT 'ok',
  restricted boolean NOT NULL DEFAULT false,
  environment text NOT NULL,
  data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL
);

-- Enable RLS
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own datasets"
ON public.datasets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own datasets"
ON public.datasets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own datasets"
ON public.datasets
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own datasets"
ON public.datasets
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_datasets_updated_at
BEFORE UPDATE ON public.datasets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();