import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      const result = response.data;

      // Store token and user data
      if (result && result.token && result.user) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

      toast({
        title: 'Success',
        description: 'Logged in successfully',
        variant: 'success',
      });

        navigate('/properties');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center text-dark-blue">Login</h2>
          <p className="text-center text-steel-blue">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password?.message && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-steel-blue hover:bg-dark-blue">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-steel-blue">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="text-dark-blue hover:text-steel-blue"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
