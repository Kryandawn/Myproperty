import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types';

type PropertyFormData = {
  title: string;
  description: string;
  price: number;
  address: string;
  property_type: "apartment" | "house" | "condo";
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
};

const PropertyCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create property');
      }

      toast({
        title: 'Success',
        description: 'Property created successfully and pending approval',
        variant: 'success'
      });

      navigate('/properties');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create property',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-dark-blue">Create New Property</h2>
          <p className="text-steel-blue">Fill in the details of your property listing</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Price"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Select
                  onValueChange={(value: "apartment" | "house" | "condo") => setValue('property_type', value)}
                  {...register('property_type', { required: 'Property type is required' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.property_type && (
                  <p className="text-red-500 text-sm">{errors.property_type.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Bedrooms"
                  {...register('bedrooms', {
                    required: 'Number of bedrooms is required',
                    min: { value: 0, message: 'Must be 0 or more' }
                  })}
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Bathrooms"
                  {...register('bathrooms', {
                    required: 'Number of bathrooms is required',
                    min: { value: 0, message: 'Must be 0 or more' }
                  })}
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Area (sq ft)"
                  {...register('area_sqft', {
                    required: 'Area is required',
                    min: { value: 0, message: 'Must be greater than 0' }
                  })}
                />
                {errors.area_sqft && (
                  <p className="text-red-500 text-sm">{errors.area_sqft.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Address"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/properties')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-steel-blue hover:bg-dark-blue"
              >
                Create Property
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyCreate;
