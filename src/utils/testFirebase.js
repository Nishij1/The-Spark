// Test Firebase connection and functionality
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  const results = {
    auth: false,
    firestore: false,
    errors: []
  };

  try {
    // Test Auth connection
    if (auth) {
      results.auth = true;
      console.log('✅ Firebase Auth initialized successfully');
    }
  } catch (error) {
    results.errors.push(`Auth Error: ${error.message}`);
    console.error('❌ Firebase Auth error:', error);
  }

  try {
    // Test Firestore connection
    if (db) {
      // Try to read from a test collection
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      results.firestore = true;
      console.log('✅ Firestore connection successful');
    }
  } catch (error) {
    results.errors.push(`Firestore Error: ${error.message}`);
    console.error('❌ Firestore error:', error);
  }

  return results;
};

export const testFirestoreOperations = async (userId) => {
  if (!userId) {
    throw new Error('User ID required for Firestore operations test');
  }

  const results = {
    create: false,
    read: false,
    delete: false,
    errors: []
  };

  let testDocId = null;

  try {
    // Test Create
    const testData = {
      name: 'Test Project',
      description: 'This is a test project',
      userId: userId,
      createdAt: new Date(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'projects'), testData);
    testDocId = docRef.id;
    results.create = true;
    console.log('✅ Firestore CREATE operation successful');

    // Test Read
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const testProject = projects.find(p => p.id === testDocId);
    
    if (testProject) {
      results.read = true;
      console.log('✅ Firestore READ operation successful');
    }

    // Test Delete
    if (testDocId) {
      await deleteDoc(doc(db, 'projects', testDocId));
      results.delete = true;
      console.log('✅ Firestore DELETE operation successful');
    }

  } catch (error) {
    results.errors.push(`Firestore Operations Error: ${error.message}`);
    console.error('❌ Firestore operations error:', error);

    // Cleanup if there was an error
    if (testDocId) {
      try {
        await deleteDoc(doc(db, 'projects', testDocId));
        console.log('🧹 Cleaned up test document');
      } catch (cleanupError) {
        console.error('❌ Failed to cleanup test document:', cleanupError);
      }
    }
  }

  return results;
};

// Test Gemini API connection
export const testGeminiConnection = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Gemini API key not configured',
      demo: true
    };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (response.ok) {
      console.log('✅ Gemini API connection successful');
      return { success: true, demo: false };
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error);
    return {
      success: false,
      error: error.message,
      demo: true
    };
  }
};

// Test project query specifically
export const testProjectQuery = async (userId) => {
  if (!userId) {
    throw new Error('User ID required for project query test');
  }

  console.log('🔍 Testing project query for user:', userId);

  try {
    // Import here to avoid circular dependencies
    const { projectService } = await import('../services/firestore');

    // Test the exact query used by the app
    const projects = await projectService.getUserProjects(userId);
    console.log('✅ Project query successful, found projects:', projects.length);
    console.log('📄 Projects:', projects);

    return {
      success: true,
      projectCount: projects.length,
      projects: projects
    };
  } catch (error) {
    console.error('❌ Project query failed:', error);
    return {
      success: false,
      error: error.message,
      projectCount: 0,
      projects: []
    };
  }
};

// Run all tests
export const runAllTests = async (userId = null) => {
  console.log('🧪 Running Project Spark connectivity tests...');

  const results = {
    firebase: await testFirebaseConnection(),
    gemini: await testGeminiConnection(),
    firestore: null,
    projectQuery: null
  };

  if (userId && results.firebase.firestore) {
    results.firestore = await testFirestoreOperations(userId);
    results.projectQuery = await testProjectQuery(userId);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`Firebase Auth: ${results.firebase.auth ? '✅' : '❌'}`);
  console.log(`Firestore: ${results.firebase.firestore ? '✅' : '❌'}`);
  console.log(`Gemini API: ${results.gemini.success ? '✅' : '❌'} ${results.gemini.demo ? '(Demo Mode)' : ''}`);

  if (results.firestore) {
    console.log(`Firestore Operations: ${results.firestore.create && results.firestore.read && results.firestore.delete ? '✅' : '❌'}`);
  }

  if (results.projectQuery) {
    console.log(`Project Query: ${results.projectQuery.success ? '✅' : '❌'} (${results.projectQuery.projectCount} projects)`);
  }

  const allErrors = [
    ...results.firebase.errors,
    ...(results.firestore?.errors || []),
    ...(results.gemini.error ? [results.gemini.error] : []),
    ...(results.projectQuery?.error ? [results.projectQuery.error] : [])
  ];

  if (allErrors.length > 0) {
    console.log('\n❌ Errors found:');
    allErrors.forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('\n🎉 All tests passed!');
  }

  return results;
};
