import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/property/PropertyCard';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.propertyType) queryParams.append('property_type', filters.propertyType);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/properties?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch properties');

      const data = await response.json();
      const filteredData = data.filter(property => {
        const price = parseFloat(property.price);
        const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });

      setProperties(filteredData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark-blue">Properties</h1>
        {['landlord', 'agent'].includes(user?.role) && (
          <Button
            onClick={() => navigate('/properties/create')}
            className="bg-steel-blue hover:bg-dark-blue"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-steel-blue" />
            <Input
              placeholder="Search properties..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="h-[300px] animate-pulse bg-light-gray" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={() => navigate(`/properties/${property.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
