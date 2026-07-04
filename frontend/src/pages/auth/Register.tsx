import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
  Container,
  Grid,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    role: z.string().min(1, 'Role is required'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
      designation: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.register({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        role: data.role.toUpperCase(),
        department: data.department,
        designation: data.designation,
      });
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Card sx={{ width: '100%', p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              LOGO
            </Box>
            <Typography variant="h5" fontWeight="bold">Create an Account</Typography>
            <Typography variant="body2" color="text.secondary">
              Register for Employee Task Management
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={4}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Role"
                      variant="outlined"
                      fullWidth
                      error={!!errors.role}
                      helperText={errors.role?.message}
                    >
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid xs={12} sm={4}>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Department"
                      variant="outlined"
                      fullWidth
                      error={!!errors.department}
                      helperText={errors.department?.message}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={4}>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Designation"
                      variant="outlined"
                      fullWidth
                      error={!!errors.designation}
                      helperText={errors.designation?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Box>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                sx={{ cursor: 'pointer' }}
                variant="body2"
                onClick={() => navigate('/login')}
                underline="hover"
              >
                Back to Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={6000}
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
