'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { AgentProvider, useAgentContext } from '@/context/AgentContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Button from '@/components/reusable/Button';
import InputField from '@/components/reusable/InputField';
import InspectionManager from '@/components/agent/InspectionManager';
import { NotificationPanel } from '@/components/reusable';
import { MessagesInterface } from '@/components/reusable';
import OneToOneChat from '@/components/ui/ContactAgentModal';
import { getSafeImageUrl } from '@/utils/imageUtils';

// Add interfaces
interface PropertyAssignment {
  id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  price: number;
  status: string;
  image?: string;
  assignedDate: string;
  priority: 'high' | 'medium' | 'low';
  beds: number;
  baths: number;
  size: number;
}


interface Inspection {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  inspector: string;
  client: string;
  notes?: string;
  address: string;
}

interface Note {
  id: string;
  propertyId?: string;
  title: string;
  content: string;
  type: 'property' | 'inspection' | 'general';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

// Add Activity interface
interface Activity {
  id: string;
  type: 'property_assigned' | 'inspection' | 'message';
  title: string;
  timestamp: string;
}

interface AgentStats {
  assignedProperties: number;
  pendingInspections: number;
  newMessages: number;
  completedInspections: number;
}
export default function AgentDashboard() {
  const { user } = useAuth();
  const currentUserId = user?.id || "68c27dff2bc1823055eae15b";
  const currentUserRole = 'agent';
  
  // Fix: Use dynamic user name instead of hardcoded value
  const [agentName, setAgentName] = useState(user?.name || 'Agent');
  const [activeTab, setActiveTab] = useState('overview');
  const [ assignments, setAssignments] = useState<PropertyAssignment[]>([]);
  console.log("🚀 ~ AgentDashboard ~ assignments:", assignments)
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
const [buyers, setBuyers] = useState<{ id: string; name: string; email?: string }[]>([]);
console.log("🚀 ~ AgentDashboard ~ buyers:", buyers)
const [selectedBuyer, setSelectedBuyer] = useState<{ id: string; name: string; email?: string } | null>(null);

  const [selectedProperty, setSelectedProperty] = useState<PropertyAssignment | null>(null);
  const [userObj, setUserObj] = useState<{ user: string } | null>(null);
  console.log("🚀 ~ AgentDashboard ~ userObj:", userObj)

  console.log("🚀 ~ AgentDashboard ~ selectedProperty:", selectedProperty)
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  
  // Add assignments loading and error states
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  
  const [inspectionForm, setInspectionForm] = useState({
    date: '',
    time: '',
    inspector: '',
    client: '',
    notes: ''
  });
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    type: 'property' as 'property' | 'inspection' | 'general',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  
  // Updated stats state with loading and error handling
  const [stats, setStats] = useState<AgentStats>({
    assignedProperties: 0,
    pendingInspections: 0,
    newMessages: 0,
    completedInspections: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Add activities state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  
  // Update agent name when user data changes
  useEffect(() => {
    if (user?.name) {
      setAgentName(user.name);
    }
  }, [user]);
  
  // Add fetchAgentProperties function
  const fetchAgentProperties = async () => {
    try {
      setAssignmentsLoading(true);
      setAssignmentsError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`http://localhost:5000/api/agent/${currentUserId}/properties`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("🚀 ~ fetchAgentProperties ~ response:----", response)
      
      // Handle 404 or other errors gracefully
      if (!response.ok) {
        if (response.status === 404) {
          // Treat 404 as empty properties, not an error
          setAssignments([]);
          return;
        }
        throw new Error('Failed to fetch assigned properties');
      }
      
      const data = await response.json();
      console.log("🚀 ~ fetchAgentProperties ~ data:", data)
      
      if (data.success) {
        // Handle empty array or undefined data gracefully
        const properties = data.data || [];
        setAssignments(properties.properties);
      } else {
        // Don't show API errors to users, just log them
        console.error('API returned error:', data.error);
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error fetching agent properties:', error);
      // Don't show technical errors to users
      setAssignmentsError(null);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };
  
  // Add fetchAgentStats function
  const fetchAgentStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      const response = await fetch(`/api/agent/${currentUserId}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent stats');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      setStatsError('Failed to load agent statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Add fetchAgentActivities function
  const fetchAgentActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      
      const response = await fetch(`/api/agent/${currentUserId}/activities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching agent activities:', error);
      setActivitiesError('Failed to load recent activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Function to get activity icon color based on type
  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'property_assigned':
        return 'bg-green-500';
      case 'inspection':
        return 'bg-blue-500';
      case 'message':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  useEffect(() => {
    // fetchAgentStats();
    // fetchAgentActivities();
    fetchAgentProperties(); // Add this line
  }, [currentUserId]);

  // // Load stats on component mount
  // useEffect(() => {
  //   if (currentUserId) {
  //     fetchAgentStats();
  //   }
  // }, [currentUserId]);

  // // Remove the mock data useEffect - replace with:
  // useEffect(() => {
  //   if (currentUserId) {
  //     fetchAgentProperties();
  //   }
  // }, [currentUserId]);

  // Add useEffect to load mock data
  useEffect(() => {
    // Load mock data
    const mockAssignments: PropertyAssignment[] = [
      {
        id: '1',
        title: 'Beautiful Family Home',
        address: '123 Maple Street, Austin, TX 78701',
        price: 750000,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        assignedDate: '2024-03-15',
        priority: 'high',
        beds: 4,
        baths: 3,
        size: 2500
      },
      {
        id: '2',
        title: 'Modern Downtown Condo',
        address: '456 Oak Avenue, Austin, TX 78702',
        price: 450000,
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
        assignedDate: '2024-03-12',
        priority: 'medium',
        beds: 2,
        baths: 2,
        size: 1200
      }
    ];
    setAssignments([]);
  }, []);

  // Add helper functions INSIDE the component
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddInspection = async () => {
    if (!inspectionForm.date || !inspectionForm.time || !inspectionForm.inspector || !inspectionForm.client) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!selectedProperty) {
      alert('Please select a property first');
      return;
    }

    try {
      // Combine date and time into datetime
      const datetime = new Date(`${inspectionForm.date}T${inspectionForm.time}`);
      
      const inspectionData = {
        propertyId: selectedProperty.id,
        datetime: datetime.toISOString(),
        inspector: {
          name: inspectionForm.inspector,
          phone: '', // Add phone field to form if needed
          email: '', // Add email field to form if needed
        },
        notes: inspectionForm.notes
      };

      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inspectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule inspection');
      }

      const result = await response.json();
      
      // Add to local state for immediate UI update
      const newInspection: Inspection = {
        id: result.data._id,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.title,
        date: inspectionForm.date,
        time: inspectionForm.time,
        status: 'scheduled',
        inspector: inspectionForm.inspector,
        client: inspectionForm.client,
        notes: inspectionForm.notes,
        // address: selectedProperty.address
      };
      
      setInspections([...inspections, newInspection]);
      setShowInspectionForm(false);
      setInspectionForm({ date: '', time: '', inspector: '', client: '', notes: '' });
      
      // Refresh stats and activities
      // fetchAgentStats();
      // fetchAgentActivities();
      
      alert('Inspection scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling inspection:', error);
      alert(`Failed to schedule inspection: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleSelectProperty = async (property: PropertyAssignment) => {
  try {
    console.log("🚀 ~ handleSelectProperty ~ property:", property);
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/payment/purchases/${property.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("No buyers found for this property");
      return;
    }

    const data = await res.json();
    setSelectedProperty(property);
    setBuyers(data || []);
    setIsContactModalOpen(true);
  } catch (err) {
    console.error("Error fetching buyers:", err);
  }
};

// const handleSelectProperty = async (property: PropertyAssignment) => {
//   try {
//     console.log("🚀 ~ handleSelectProperty ~ property:", property);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       // not logged in → redirect to signin
//       window.location.href = "/signin";
//       return;
//     }

//     // Call backend API
//     const res = await fetch(
//       `http://localhost:5000/api/payment/purchases/${property.id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!res.ok) {
//       alert("No purchase found");
//       // optional: show alert or block modal if user has not paid
//       return;
//     }

//     const purchase = await res.json();
//     console.log("✅ Purchase details:", purchase);

//     // if purchase is paid → allow opening modal
//     if (purchase.status === "paid") {
//       setSelectedProperty(property);
//       setIsContactModalOpen(true);
//          setUserObj({ id: purchase.user });
//     }
//   } catch (err) {
//     console.error("Error checking purchase:", err);
//   }
// };

  // const handleSelectProperty = (property: PropertyAssignment) => {
  //   console.log("🚀 ~ handleSelectProperty ~ property:", property)
  //   setSelectedProperty(property);
  //     setIsContactModalOpen(true);
  // };

  const handleShowInspectionForm = () => {
    setShowInspectionForm(true);
  };

  const handleAddNote = () => {
    if (noteForm.title.trim() && noteForm.content.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        propertyId: selectedProperty?.id,
        title: noteForm.title,
        content: noteForm.content,
        type: noteForm.type,
        priority: noteForm.priority,
        createdAt: new Date().toISOString()
      };
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setNoteForm({
        title: '',
        content: '',
        type: 'property',
        priority: 'medium'
      });
      setShowNoteForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Navbar 
          logo="/logo.svg"
          logoText=""
        />
        <div className="absolute top-0 right-0 p-4">
          <NotificationPanel 
            userId="agent-123" 
            userType="agent" 
            className="mr-4"
          />
        </div>
      </div>
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {agentName}!
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Manage your properties, inspections, and client communications.
            </p>
          </div>
        </div>
      </section>

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'properties', label: 'Assigned Properties' },
                { id: 'inspections', label: 'Inspections' },
                { id: 'notes', label: 'Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  {statsLoading ? (
                    <div className="text-3xl font-bold text-gray-400">...</div>
                  ) : (
                    <div className="text-3xl font-bold text-green-600">{stats.assignedProperties}</div>
                  )}
                  <div className="text-gray-600">Assigned Properties</div>
                  {statsError && (
                    <div className="text-xs text-red-500 mt-1">Failed to load</div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  {statsLoading ? (
                    <div className="text-3xl font-bold text-gray-400">...</div>
                  ) : (
                    <div className="text-3xl font-bold text-blue-600">{stats.pendingInspections}</div>
                  )}
                  <div className="text-gray-600">Pending Inspections</div>
                  {statsError && (
                    <div className="text-xs text-red-500 mt-1">Failed to load</div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  {statsLoading ? (
                    <div className="text-3xl font-bold text-gray-400">...</div>
                  ) : (
                    <div className="text-3xl font-bold text-purple-600">{stats.newMessages}</div>
                  )}
                  <div className="text-gray-600">New Messages</div>
                  {statsError && (
                    <div className="text-xs text-red-500 mt-1">Failed to load</div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  {statsLoading ? (
                    <div className="text-3xl font-bold text-gray-400">...</div>
                  ) : (
                    <div className="text-3xl font-bold text-orange-600">{stats.completedInspections}</div>
                  )}
                  <div className="text-gray-600">Completed Inspections</div>
                  {statsError && (
                    <div className="text-xs text-red-500 mt-1">Failed to load</div>
                  )}
                </div>
              </div>
            </div>

            {/* Refresh Stats Button */}
            {/* {statsError && (
              <div className="mb-6 text-center">
                <Button
                  onClick={fetchAgentStats}
                  disabled={statsLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {statsLoading ? 'Loading...' : 'Retry Loading Stats'}
                </Button>
              </div>
            )} */}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading activities...</span>
                </div>
              ) : activitiesError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">{activitiesError}</p>
                  <Button 
                    // onClick={fetchAgentActivities}
                    className="text-sm px-4 py-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent activities found
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getActivityIconColor(activity.type)}`}></div>
                      <span className="text-gray-700 flex-1">{activity.title}</span>
                      <span className="text-gray-500 text-sm">{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assigned Properties</h2>
              <Button
                onClick={fetchAgentProperties}
                variant="outline"
                className="text-sm"
                disabled={assignmentsLoading}
              >
                {assignmentsLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            {assignmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading properties...</span>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available right now</h3>
                <p className="text-gray-500 mb-4">Properties will automatically appear here when sellers assign them to you.</p>
                <Button 
                  onClick={fetchAgentProperties}
                  variant="outline"
                  disabled={assignmentsLoading}
                >
                  Check for Updates
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(assignments) && assignments.map((assignment) => {
  const safeImageUrl = getSafeImageUrl(assignment.mainImage.url, "property");
  console.log("🚀 ~ safeImageUrl:", safeImageUrl)

  return (
    <div
      key={assignment.id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={safeImageUrl}
          alt={`${assignment.title} - ${typeof assignment.address === "string" ? assignment.address : `${assignment.address.street}, ${assignment.address.city}`}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/default-property.jpg"; // fallback image
          }}
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
              assignment.priority
            )}`}
          >
            {assignment.priority}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{assignment.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {typeof assignment.address === "string"
            ? assignment.address
            : `${assignment.address.street}, ${assignment.address.city}, ${assignment.address.state} ${assignment.address.zipCode}`}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${assignment.price.toLocaleString()}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              assignment.status === "active"
                ? "bg-green-100 text-green-800"
                : assignment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {assignment.status}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>{assignment.beds} beds</span>
          <span>{assignment.baths} baths</span>
          <span>{assignment.size} sqft</span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSelectProperty(assignment)}
            variant="primary"
            className="flex-1 text-sm"
          >
            View Details
          </Button>
          <Button
            onClick={handleShowInspectionForm}
            variant="outline"
            className="flex-1 text-sm"
          >
            Schedule Inspection
          </Button>
        </div>
      </div>
    </div>
  );
})}


{isContactModalOpen && selectedProperty && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl w-full max-w-2xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">
          {selectedBuyer ? `Chat with ${selectedBuyer.name}` : "Select a Buyer"}
        </h2>
        <button onClick={() => {
          setIsContactModalOpen(false);
          setSelectedBuyer(null);
        }}>✕</button>
      </div>

      <div className="p-4">
        {!selectedBuyer ? (
          buyers.length > 0 ? (
            <ul className="space-y-2">
              {buyers.map((b) => (
                <li key={b.id}> 
                  <button
                    onClick={() => setSelectedBuyer(b.user)}
                    className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <p className="font-medium">{b.user.name}</p>
                    <p className="text-xs text-gray-500">{b.user.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No buyers yet for this property.</p>
          )
        ) : (
          <OneToOneChat
            agent={{ id: selectedBuyer._id, name: selectedBuyer.name, email: selectedBuyer.email }}
            propertyTitle={selectedProperty.title}
          />
        )}
      </div>
    </div>
  </div>
)}

{/* {isContactModalOpen && selectedProperty?.agents?.length > 0 && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl w-full max-w-2xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with buyer</h2>
        <button onClick={() => setIsContactModalOpen(false)}>✕</button>
      </div>
      <div className="p-4">
        <OneToOneChat
          agent={userObj}
          propertyTitle={selectedProperty.title}
        />
      </div>
    </div>
  </div>
)} */}


              </div>
            )}
          </div>
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Inspections</h2>
              <Button
                onClick={() => setShowInspectionForm(true)}
                variant="primary"
              >
                Schedule Inspection
              </Button>
            </div>

            {/* Inspection Form Modal */}
            {showInspectionForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Schedule New Inspection</h3>
                  <div className="space-y-4">
                    <InputField
                      label="Date"
                      type="date"
                      value={inspectionForm.date}
                      onChange={(e) => setInspectionForm({...inspectionForm, date: e.target.value})}
                    />
                    <InputField
                      label="Time"
                      type="time"
                      value={inspectionForm.time}
                      onChange={(e) => setInspectionForm({...inspectionForm, time: e.target.value})}
                    />
                    <InputField
                      label="Inspector"
                      value={inspectionForm.inspector}
                      onChange={(e) => setInspectionForm({...inspectionForm, inspector: e.target.value})}
                    />
                    <InputField
                      label="Client"
                      value={inspectionForm.client}
                      onChange={(e) => setInspectionForm({...inspectionForm, client: e.target.value})}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={inspectionForm.notes}
                        onChange={(e) => setInspectionForm({...inspectionForm, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button onClick={handleAddInspection} variant="primary" className="flex-1">
                      Schedule
                    </Button>
                    <Button onClick={() => setShowInspectionForm(false)} variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Inspections List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inspections.map((inspection) => (
                      <tr key={inspection.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{inspection.propertyName}</div>
                            <div className="text-sm text-gray-500">{inspection.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.date} at {inspection.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.inspector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getStatusColor(inspection.status)
                          }`}>
                            {inspection.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="bg-white rounded-lg shadow-lg" style={{ height: '600px' }}>
              <MessagesInterface
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                className="h-full"
              />
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notes & Documentation</h2>
              <Button
                onClick={() => setShowNoteForm(true)}
                variant="primary"
              >
                Add Note
              </Button>
            </div>

            {/* Note Form Modal */}
            {showNoteForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
                  <div className="space-y-4">
                    <InputField
                      label="Title"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={noteForm.content}
                        onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={noteForm.type}
                        onChange={(e) => setNoteForm({...noteForm, type: e.target.value as 'property' | 'inspection' | 'general'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="property">Property</option>
                        <option value="inspection">Inspection</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={noteForm.priority}
                        onChange={(e) => setNoteForm({...noteForm, priority: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button onClick={handleAddNote} variant="primary" className="flex-1">
                      Add Note
                    </Button>
                    <Button onClick={() => setShowNoteForm(false)} variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        getPriorityColor(note.priority)
                      }`}>
                        {note.priority}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        {note.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{note.content}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}