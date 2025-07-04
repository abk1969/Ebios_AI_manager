/**
 * 🗑️ NETTOYAGE SÉCURISÉ DES MISSIONS CRÉÉES MANUELLEMENT
 * Script pour supprimer uniquement les missions créées manuellement
 * tout en préservant les missions générées automatiquement
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, where } = require('firebase/firestore');

// Configuration Firebase (production réelle)
const firebaseConfig = {
  apiKey: "AIzaSyCN4GaNMnshiDw0Z0dgGnhmgbokVyd7LmA",
  authDomain: "ebiosdatabase.firebaseapp.com",
  projectId: "ebiosdatabase",
  storageBucket: "ebiosdatabase.firebasestorage.app",
  messagingSenderId: "1065555617003",
  appId: "1:1065555617003:web:876f78760b435289a74aae"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanManualMissions() {
  console.log('🔍 ANALYSE DES MISSIONS EXISTANTES');
  console.log('=====================================');

  try {
    // Récupérer toutes les missions
    const missionsRef = collection(db, 'missions');
    const snapshot = await getDocs(missionsRef);
    
    console.log(`📊 Total missions trouvées: ${snapshot.size}`);
    
    if (snapshot.empty) {
      console.log('✅ Aucune mission trouvée - Base déjà propre');
      return;
    }

    const missions = [];
    const manualMissions = [];
    const autoMissions = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const mission = {
        id: doc.id,
        name: data.name || 'Sans nom',
        description: data.description || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || 'Date inconnue',
        organizationContext: data.organizationContext || {},
        // Indicateur de génération automatique
        isAutoGenerated: data.isAutoGenerated || false,
        generatedBy: data.generatedBy || null
      };
      
      missions.push(mission);

      // Classification : Auto vs Manuel
      if (mission.isAutoGenerated || mission.generatedBy === 'AutoMissionGeneratorService') {
        autoMissions.push(mission);
      } else {
        manualMissions.push(mission);
      }
    });

    console.log('\n📋 CLASSIFICATION DES MISSIONS:');
    console.log(`🤖 Missions automatiques: ${autoMissions.length}`);
    console.log(`👤 Missions manuelles: ${manualMissions.length}`);

    // Afficher les détails
    if (autoMissions.length > 0) {
      console.log('\n🤖 MISSIONS AUTOMATIQUES (À PRÉSERVER):');
      autoMissions.forEach((mission, index) => {
        console.log(`   ${index + 1}. "${mission.name}" (${mission.id})`);
        console.log(`      📅 Créée: ${mission.createdAt}`);
        console.log(`      🏢 Organisation: ${mission.organizationContext?.organizationType || 'Non définie'}`);
      });
    }

    if (manualMissions.length > 0) {
      console.log('\n👤 MISSIONS MANUELLES (À SUPPRIMER):');
      manualMissions.forEach((mission, index) => {
        console.log(`   ${index + 1}. "${mission.name}" (${mission.id})`);
        console.log(`      📅 Créée: ${mission.createdAt}`);
        console.log(`      📝 Description: ${mission.description.substring(0, 50)}${mission.description.length > 50 ? '...' : ''}`);
      });

      console.log('\n🚨 SUPPRESSION DES MISSIONS MANUELLES...');
      
      let deletedCount = 0;
      for (const mission of manualMissions) {
        try {
          await deleteDoc(doc(db, 'missions', mission.id));
          console.log(`   ✅ Supprimée: "${mission.name}" (${mission.id})`);
          deletedCount++;
        } catch (error) {
          console.error(`   ❌ Erreur suppression "${mission.name}":`, error.message);
        }
      }

      console.log(`\n🎉 NETTOYAGE TERMINÉ: ${deletedCount}/${manualMissions.length} missions supprimées`);
    } else {
      console.log('\n✅ Aucune mission manuelle trouvée - Rien à supprimer');
    }

    // Vérification finale
    console.log('\n🔍 VÉRIFICATION FINALE...');
    const finalSnapshot = await getDocs(missionsRef);
    console.log(`📊 Missions restantes: ${finalSnapshot.size}`);
    
    if (finalSnapshot.size === autoMissions.length) {
      console.log('✅ SUCCÈS: Seules les missions automatiques sont conservées');
    } else {
      console.log('⚠️  ATTENTION: Nombre de missions restantes inattendu');
    }

  } catch (error) {
    console.error('❌ ERREUR lors du nettoyage:', error);
    throw error;
  }
}

// Fonction de vérification avant suppression
async function verifyBeforeClean() {
  console.log('🛡️  VÉRIFICATION DE SÉCURITÉ');
  console.log('============================');
  
  try {
    const missionsRef = collection(db, 'missions');
    const snapshot = await getDocs(missionsRef);
    
    if (snapshot.empty) {
      console.log('ℹ️  Aucune mission trouvée');
      return false;
    }

    console.log(`📊 ${snapshot.size} mission(s) trouvée(s)`);
    
    let hasManualMissions = false;
    snapshot.forEach(doc => {
      const data = doc.data();
      const isAuto = data.isAutoGenerated || data.generatedBy === 'AutoMissionGeneratorService';
      if (!isAuto) {
        hasManualMissions = true;
      }
    });

    if (!hasManualMissions) {
      console.log('✅ Aucune mission manuelle détectée');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    return false;
  }
}

// Exécution principale
async function main() {
  console.log('🗑️  NETTOYAGE SÉCURISÉ DES MISSIONS MANUELLES');
  console.log('==============================================');
  console.log('🎯 OBJECTIF: Supprimer uniquement les missions créées manuellement');
  console.log('🛡️  SÉCURITÉ: Préserver les missions générées automatiquement');
  console.log('');

  try {
    // Vérification préalable
    const shouldProceed = await verifyBeforeClean();
    
    if (!shouldProceed) {
      console.log('🏁 ARRÊT: Aucune action nécessaire');
      return;
    }

    // Nettoyage
    await cleanManualMissions();
    
    console.log('\n🎉 NETTOYAGE TERMINÉ AVEC SUCCÈS !');
    console.log('✅ Base de données prête pour les nouvelles missions avec contexte');
    
  } catch (error) {
    console.error('\n💥 ÉCHEC DU NETTOYAGE:', error);
    process.exit(1);
  }
}

// Lancement du script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { cleanManualMissions, verifyBeforeClean };
