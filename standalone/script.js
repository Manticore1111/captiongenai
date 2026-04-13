document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('captionForm');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    const hook = document.getElementById('hook');
    const captions = document.getElementById('captions');
    const hashtags = document.getElementById('hashtags');
    const saveBtn = document.getElementById('saveBtn');
    const tone = document.getElementById('tone');
    const goal = document.getElementById('goal');
    const scheduleDate = document.getElementById('scheduleDate');
    const savedGenerationsList = document.getElementById('savedGenerationsList');
    const templateChips = document.querySelectorAll('.template-chip');
    const trending = document.getElementById('trending');
    const trendingTopics = document.getElementById('trendingTopics');
    const searchSaved = document.getElementById('searchSaved');
    const filterPlatform = document.getElementById('filterPlatform');

    if (saveBtn) {
        saveBtn.addEventListener('click', saveGeneration);
    }
    if (templateChips && templateChips.length > 0) {
        templateChips.forEach(button => button.addEventListener('click', () => applyTemplate(button.dataset.template)));
    }
    if (searchSaved) {
        searchSaved.addEventListener('input', filterSavedGenerations);
    }
    if (filterPlatform) {
        filterPlatform.addEventListener('change', filterSavedGenerations);
    }
    loadSavedGenerations();
    
    const initialUsageCount = parseInt(localStorage.getItem('usageCount') || '0');
    updateUsageMeter(initialUsageCount, 3);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateCaptions();
    });

    function generateCaptions() {
        const topic = document.getElementById('topic').value.trim();
        const platform = document.getElementById('platform').value;
        const toneValue = tone.value;
        const goalValue = goal.value;
        const schedule = scheduleDate ? scheduleDate.value : '';

        console.log('Generating content for:', topic, platform, toneValue, goalValue, schedule);

        let usageCount = parseInt(localStorage.getItem('usageCount') || '0');
        const maxFree = 3;

        // Gratis limit tijdelijk uitgeschakeld
        // if (usageCount >= maxFree && !localStorage.getItem('paid')) {
        //     alert('Je hebt je gratis limiet bereikt. Upgrade naar premium om door te gaan.');
        //     window.location.href = 'checkout.html';
        //     return;
        // }

        if (!topic) {
            showError('Voer een onderwerp of idee in.');
            return;
        }

        showLoading(true);
        hideError();
        hideResults();

        try {
            setTimeout(() => {
                const fakeResults = generateFakeResults(platform, topic, toneValue, goalValue);
                displayResults(fakeResults);
                displayTrending(platform);
                if (saveBtn) saveBtn.style.display = 'inline-block';
                showLoading(false);

                usageCount++;
                localStorage.setItem('usageCount', usageCount.toString());
                updateUsageMeter(usageCount, maxFree);
            }, 1200);
        } catch (error) {
            console.error('Generation error:', error);
            showError('Er is een fout opgetreden bij het genereren van captions. Probeer het opnieuw.');
            showLoading(false);
        }
    }

    function generateFakeResults(platform, topic, toneValue, goalValue) {
        const captionsList = [
            `Caption 1: ${toneValue} verhaal over ${topic} voor ${platform}.`,
            `Caption 2: Deze ${topic} post op ${platform} voelt direct als een hit.`,
            `Caption 3: Zet je viewers aan het denken met dit ${platform} idee over ${topic}.`,
            `Caption 4: De perfecte combinatie van stijl en energie voor ${platform}.`,
            `Caption 5: Tips voor ${topic} die jouw ${platform} audience willen zien.`,
            `Caption 6: Dit ${topic} moment past precies bij jouw ${platform} branding.`,
            `Caption 7: Maak je content slimmer en viraler met deze ${topic} tip.`,
            `Caption 8: Laat je volgers niet achter met dit ${platform} advies over ${topic}.`
        ];
        const hashtagsList = [
            `#${platform.toLowerCase()}`, `#${topic.replace(/\s+/g, '')}`, '#viral', '#trending', '#content', '#social', '#tips', '#creative', '#branding', '#engagement'
        ];
        const hookSentence = `Hook: Wist je dat je met deze ${topic} op ${platform} direct meer aandacht trekt?`;
        const storyText = `Story: ${toneValue} backstage moment met ${topic}, perfecte content voor je volgers.`;
        const ctaText = `CTA: Swipe omhoog om meer te ontdekken over ${topic} op ${platform}.`;
        const postIdea = `Post idee: Laat zien hoe ${topic} jouw ${platform} feed leuker en krachtiger maakt.`;

        // Platform-specifieke ideeën
        let platformIdeas = [];
        
        if (platform === 'TikTok') {
            platformIdeas = [
                `🎬 Trending Sound: Gebruik een populaire trending sound en sync je video met ${topic}`,
                `🔄 Duet/Stitch: Reageer op een bestaande TikTok met jouw ${topic} perspectief`,
                `⚡ Hook first 3 seconden: Open met een eye-catching ${topic} moment`,
                `📍 Hook prompt: Vraag iets dat viewers moet beantwoorden over ${topic}`,
                `🎵 Trending hashtag challenge: Maak een challenge rond ${topic}`
            ];
        } else if (platform === 'Instagram') {
            platformIdeas = [
                `📸 Reels: 15-30 sec video over ${topic} met trending audio`,
                `🎠 Carousel post: 3-5 foto's over ${topic} met storytelling`,
                `📖 Story series: Deel je ${topic} journey over meerdere stories`,
                `✨ Reel hook: Start met een vraag of statement over ${topic}`,
                `🎯 Caption strategy: Emojis + call-to-action over ${topic}`
            ];
        } else if (platform === 'YouTube') {
            platformIdeas = [
                `📌 Video title: "[${toneValue}] Alles wat je moet weten over ${topic}"`,
                `📝 Description: Voeg timestamps toe voor verschillende ${topic} segmenten`,
                `⏱️ Video length: 8-12 minuten format voor ${topic} content`,
                `🎬 Thumbnail: Bold design met ${topic} keyword zichtbaar`,
                `📊 SEO tags: Voeg 15+ relevante tags rond ${topic} toe`
            ];
        } else if (platform === 'Twitter') {
            platformIdeas = [
                `🧵 Thread starten: Deel 5-10 tweets over ${topic} met #1 hook`,
                `💬 Hot take: Controversieel standpunt over ${topic}`,
                `📰 News angle: Koppel ${topic} aan trending news`,
                `❓ Ask your audience: Vraag engagement over ${topic}`,
                `🔗 Share resource: Deel artikel/tool over ${topic} met samenvatting`
            ];
        } else if (platform === 'Facebook') {
            platformIdeas = [
                `👥 Community focus: Connect met ${topic} vraag aan je community`,
                `📸 Photo story: Post foto met emotional story over ${topic}`,
                `🎉 Event promotion: Maak event rond ${topic}`,
                `💡 Educational: Share tips en tricks over ${topic}`,
                `🎁 Engagement boost: Vraag feedback over ${topic} in comments`
            ];
        } else if (platform === 'LinkedIn') {
            platformIdeas = [
                `💼 Professional insight: Deel ${topic} als business lesson`,
                `🚀 Career story: Hoe ${topic} je carrière versnelde`,
                `📊 Industry trend: Analyseer ${topic} trend in je industrie`,
                `🎓 Knowledge share: Educatieve post over ${topic} for professionals`,
                `💡 Personal brand: Toon expertise over ${topic}`
            ];
        }

        return {
            hook: hookSentence,
            captions: captionsList,
            hashtags: hashtagsList.join(' '),
            platformIdeas: platformIdeas,
            storyBio: storyText,
            ctaVariant: ctaText,
            postIdea: postIdea
        };
    }

    function displayResults(data) {
        hook.textContent = data.hook;
        captions.innerHTML = '';
        data.captions.forEach((caption, index) => {
            const div = document.createElement('div');
            div.className = 'caption-item';
            const icon = document.createElement('span');
            icon.className = 'caption-icon';
            icon.textContent = '📱';
            const p = document.createElement('p');
            p.textContent = caption;
            const btn = document.createElement('button');
            btn.textContent = 'Kopiëren';
            btn.onclick = () => copyToClipboard(caption);
            div.appendChild(icon);
            div.appendChild(p);
            div.appendChild(btn);
            captions.appendChild(div);
        });
        hashtags.textContent = data.hashtags;
        
        // Platform-specifieke ideeën weergeven
        const platformIdeasDiv = document.getElementById('platformIdeas');
        platformIdeasDiv.innerHTML = '';
        if (data.platformIdeas && data.platformIdeas.length > 0) {
            data.platformIdeas.forEach((idea) => {
                const ideaDiv = document.createElement('div');
                ideaDiv.className = 'idea-item';
                const ideaText = document.createElement('p');
                ideaText.textContent = idea;
                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Kopiëren';
                copyBtn.className = 'idea-copy-btn';
                copyBtn.onclick = () => copyToClipboard(idea);
                ideaDiv.appendChild(ideaText);
                ideaDiv.appendChild(copyBtn);
                platformIdeasDiv.appendChild(ideaDiv);
            });
        }
        
        document.getElementById('storyBio').textContent = data.storyBio;
        document.getElementById('ctaVariant').textContent = data.ctaVariant;
        document.getElementById('postIdea').textContent = data.postIdea;
        results.style.display = 'block';
    }

    function displayTrending(platform) {
        const trendingTopicsList = [
            `#${platform}Trends`, `#Viral${platform}`, `#${platform}Hacks`, `#${platform}Tips`, `#TrendingOn${platform}`
        ];
        trendingTopics.innerHTML = '';
        trendingTopicsList.forEach(topic => {
            const span = document.createElement('span');
            span.className = 'trending-topic';
            span.textContent = topic;
            span.onclick = () => {
                copyToClipboard(topic);
                alert(`${topic} gekopieerd naar klembord!`);
            };
            trendingTopics.appendChild(span);
        });
        trending.style.display = 'block';
    }

    function saveGeneration() {
        const topic = document.getElementById('topic').value;
        const platform = document.getElementById('platform').value;
        const hook = document.getElementById('hook').textContent;
        const captions = Array.from(document.querySelectorAll('#captions .caption-item p')).map(p => p.textContent);
        const hashtags = document.getElementById('hashtags').textContent;

        const generation = {
            topic,
            platform,
            tone: tone.value,
            goal: goal.value,
            schedule: scheduleDate.value || 'Niet gepland',
            hook,
            captions,
            hashtags,
            date: new Date().toISOString()
        };

        let savedGenerations = JSON.parse(localStorage.getItem('savedGenerations') || '[]');
        savedGenerations.push(generation);
        localStorage.setItem('savedGenerations', JSON.stringify(savedGenerations));
        filterSavedGenerations();

        alert('Concept opgeslagen!');
    }

    function updateUsageMeter(usageCount, maxFree) {
        const meterFill = document.querySelector('.meter-fill');
        if (!meterFill) return;
        
        const percentage = Math.min(100, Math.round((usageCount / maxFree) * 100));
        meterFill.style.width = `${percentage}%`;
        const usageInfo = document.querySelector('.usage-info span');
        if (usageInfo) {
            usageInfo.textContent = `${usageCount}/${maxFree} gebruikt`;
        }
    }

    function applyTemplate(templateText) {
        const topicInput = document.getElementById('topic');
        topicInput.value = templateText;
        topicInput.focus();
    }

    function loadSavedGenerations() {
        const savedGenerations = JSON.parse(localStorage.getItem('savedGenerations') || '[]');
        filterSavedGenerations();
    }

    function renderSavedGenerations(savedGenerations) {
        savedGenerationsList.innerHTML = '';
        if (!savedGenerations.length) {
            savedGenerationsList.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">Je hebt nog geen opgeslagen concepten.</p>';
            return;
        }

        savedGenerations.slice().reverse().forEach(item => {
            const card = document.createElement('div');
            card.className = 'saved-item';
            const title = document.createElement('h3');
            title.textContent = `${item.goal} voor ${item.topic}`;
            const details = document.createElement('p');
            details.textContent = `Platform: ${item.platform} · Stijl: ${item.tone}`;
            const schedule = document.createElement('p');
            if (item.schedule) {
                schedule.textContent = `📅 Gepland: ${item.schedule}`;
                schedule.style.color = '#9c27b0';
            }
            const snippet = document.createElement('p');
            snippet.textContent = item.captions?.[0] || 'Geen captions beschikbaar.';
            const timeTag = document.createElement('time');
            timeTag.textContent = new Date(item.date).toLocaleString('nl-NL');
            card.appendChild(title);
            card.appendChild(details);
            if (item.schedule) card.appendChild(schedule);
            card.appendChild(snippet);
            card.appendChild(timeTag);
            savedGenerationsList.appendChild(card);
        });
    }

    function filterSavedGenerations() {
        const searchTerm = searchSaved?.value.toLowerCase() || '';
        const platformFilter = filterPlatform?.value || '';
        const savedGenerations = JSON.parse(localStorage.getItem('savedGenerations') || '[]');
        
        const filtered = savedGenerations.filter(item => {
            const matchesSearch = searchTerm === '' || 
                item.topic.toLowerCase().includes(searchTerm) ||
                item.goal.toLowerCase().includes(searchTerm) ||
                (item.captions?.[0] || '').toLowerCase().includes(searchTerm);
            
            const matchesPlatform = platformFilter === '' || item.platform === platformFilter;
            
            return matchesSearch && matchesPlatform;
        });
        
        renderSavedGenerations(filtered);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Tekst gekopieerd naar klembord!');
        }).catch(() => {
            alert('Kopiëren is niet gelukt. Probeer het opnieuw.');
        });
    }

    function showLoading(show) {
        loading.style.display = show ? 'block' : 'none';
        generateBtn.disabled = show;
    }

    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
    }

    function hideError() {
        error.style.display = 'none';
    }

    function hideResults() {
        results.style.display = 'none';
    }
});