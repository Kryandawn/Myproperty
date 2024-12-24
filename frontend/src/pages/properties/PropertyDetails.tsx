import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch property details');

      const data = await response.json();
      setProperty(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: id,
          message
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast({
        title: 'Success',
        description: 'Message sent successfully',
        variant: 'success'
      });

      setMessage('');
      setShowContactForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-steel-blue"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl text-dark-blue">Property not found</h2>
        <Button
          className="mt-4 bg-steel-blue hover:bg-dark-blue"
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="p-0">
          <div className="relative h-96 bg-light-gray">
            <img
              src={property.image_url || 'https://via.placeholder.com/800x400'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <Badge 
              className={`absolute top-4 right-4 ${
                property.status === 'pending' ? 'bg-yellow-500' :
                property.status === 'approved' ? 'bg-green-500' :
                'bg-red-500'
              }`}
            >
              {property.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-dark-blue">{property.title}</h1>
              <div className="flex items-center mt-2 text-steel-blue">
                <MapPin className="w-4 h-4 mr-2" />
                <p>{property.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-steel-blue">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-sm text-steel-blue">
                ${(property.price / property.area_sqft).toFixed(2)}/sqft
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-light-gray">
            <div className="flex items-center justify-center space-x-2 text-steel-blue">
              <BedDouble className="w-5 h-5" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-steel-blue">
              <Bath className="w-5 h-5" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-steel-blue">
              <Square className="w-5 h-5" />
              <span>{property.area_sqft} sqft</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-dark-blue mb-2">Description</h2>
            <p className="text-steel-blue whitespace-pre-line">{property.description}</p>
          </div>

          {showContactForm ? (
            <form onSubmit={handleContact} className="space-y-4">
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
                required
              />
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="bg-steel-blue hover:bg-dark-blue"
                >
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button
              onClick={() => setShowContactForm(true)}
              className="bg-steel-blue hover:bg-dark-blue"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Owner
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetails;
