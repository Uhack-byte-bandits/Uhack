// Symptom Checker Application
document.addEventListener('DOMContentLoaded', function() {
    const symptomCheckboxes = document.querySelectorAll('.symptom-checkbox');
    const selectedList = document.getElementById('selectedSymptomsList');
    const symptomCount = document.getElementById('symptomCount');
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    const searchInput = document.getElementById('symptomSearch');

    let selectedSymptoms = [];

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const symptomItems = document.querySelectorAll('.symptom-item');

            symptomItems.forEach(item => {
                const symptomText = item.querySelector('.symptom-label').textContent.toLowerCase();
                if (symptomText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }

    // Handle symptom selection
    symptomCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedSymptoms();
        });
    });

    function updateSelectedSymptoms() {
        selectedSymptoms = Array.from(symptomCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Update count
        symptomCount.textContent = selectedSymptoms.length;

        // Update selected list display
        selectedList.innerHTML = '';
        if (selectedSymptoms.length === 0) {
            selectedList.innerHTML = '<span style="color: var(--text-secondary);">No symptoms selected</span>';
        } else {
            selectedSymptoms.forEach(symptom => {
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `
                    ${symptom}
                    <span class="remove-tag" data-symptom="${symptom}">×</span>
                `;
                selectedList.appendChild(tag);
            });

            // Add event listeners to remove tags
            document.querySelectorAll('.remove-tag').forEach(removeBtn => {
                removeBtn.addEventListener('click', function() {
                    const symptomToRemove = this.dataset.symptom;
                    const checkbox = Array.from(symptomCheckboxes)
                        .find(cb => cb.value === symptomToRemove);
                    if (checkbox) {
                        checkbox.checked = false;
                        updateSelectedSymptoms();
                    }
                });
            });
        }

        // Enable/disable diagnose button
        diagnoseBtn.disabled = selectedSymptoms.length === 0;
    }

    // Handle diagnosis request
    if (diagnoseBtn) {
        diagnoseBtn.addEventListener('click', async function() {
            if (selectedSymptoms.length === 0) return;

            // Show loading state
            const originalText = diagnoseBtn.textContent;
            diagnoseBtn.disabled = true;
            diagnoseBtn.innerHTML = '<span class="loading"></span> Analyzing...';

            try {
                const response = await fetch('/diagnose', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        symptoms: selectedSymptoms
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get diagnosis');
                }

                const data = await response.json();
                displayResults(data);

                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });

            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while processing your request. Please try again.');
            } finally {
                // Restore button state
                diagnoseBtn.disabled = false;
                diagnoseBtn.textContent = originalText;
            }
        });
    }

    function displayResults(data) {
        resultsContent.innerHTML = '';

        if (!data.diagnoses || data.diagnoses.length === 0) {
            resultsContent.innerHTML = `
                <div class="diagnosis-item">
                    <p>No matching diagnoses found for the selected symptoms. Please consult a healthcare professional for proper evaluation.</p>
                </div>
            `;
        } else {
            // Add summary
            const summary = document.createElement('div');
            summary.innerHTML = `
                <div style="margin-bottom: 2rem; padding: 1rem; background-color: var(--bg-color); border-radius: 0.375rem;">
                    <h4>Analysis Summary</h4>
                    <p style="color: var(--text-secondary);">
                        Based on your ${data.symptoms.length} symptom(s), we found ${data.diagnoses.length} possible condition(s).
                        Results are ranked by match score and confidence level.
                    </p>
                </div>
            `;
            resultsContent.appendChild(summary);

            // Display each diagnosis
            data.diagnoses.forEach((diagnosis, index) => {
                const diagnosisDiv = document.createElement('div');
                diagnosisDiv.className = 'diagnosis-item';
                diagnosisDiv.style.borderLeftWidth = index === 0 ? '4px' : '2px';
                diagnosisDiv.style.borderLeftColor = index === 0 ? 'var(--primary-color)' : 'var(--border-color)';

                let severityClass = 'severity-low';
                if (diagnosis.severity === 'Medium') severityClass = 'severity-medium';
                if (diagnosis.severity === 'High') severityClass = 'severity-high';

                diagnosisDiv.innerHTML = `
                    <div class="diagnosis-header">
                        <div>
                            <div class="diagnosis-title">
                                ${index + 1}. ${diagnosis.disease}
                            </div>
                        </div>
                        <span class="severity-badge ${severityClass}">
                            ${diagnosis.severity} Severity
                        </span>
                    </div>

                    <div class="diagnosis-scores">
                        <div class="score-item">
                            <div class="score-label">Match Score: ${diagnosis.match_score}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${diagnosis.match_score}%"></div>
                            </div>
                        </div>
                        <div class="score-item">
                            <div class="score-label">Confidence: ${diagnosis.confidence}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${diagnosis.confidence}%"></div>
                            </div>
                        </div>
                    </div>

                    <p class="diagnosis-description">${diagnosis.description}</p>

                    <div class="matched-symptoms">
                        <h4>Matching Symptoms:</h4>
                        <ul>
                            ${diagnosis.matched_symptoms.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="recommendations">
                        <h4>💡 Recommendations:</h4>
                        <ul>
                            ${diagnosis.recommendations.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                `;

                resultsContent.appendChild(diagnosisDiv);
            });

            // Add disclaimer
            const disclaimer = document.createElement('div');
            disclaimer.innerHTML = `
                <div style="margin-top: 2rem; padding: 1rem; background-color: #fef3c7; border-left: 4px solid var(--warning-color); border-radius: 0.375rem;">
                    <strong>⚠️ Important:</strong> These results are for informational purposes only. 
                    Please consult a qualified healthcare professional for proper diagnosis and treatment.
                </div>
            `;
            resultsContent.appendChild(disclaimer);
        }

        resultsSection.style.display = 'block';
    }

    // Initialize
    updateSelectedSymptoms();
});
