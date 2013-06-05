# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'GameInstance.player_email'
        db.alter_column(u'application_gameinstance', 'player_email', self.gf('django.db.models.fields.EmailField')(max_length=100))

    def backwards(self, orm):

        # Changing field 'GameInstance.player_email'
        db.alter_column(u'application_gameinstance', 'player_email', self.gf('django.db.models.fields.CharField')(max_length=100))

    models = {
        u'application.applicationdocumentfiles': {
            'Meta': {'object_name': 'Applicationdocumentfiles', 'db_table': "'ApplicationDocumentFiles'", 'managed': 'False'},
            'data': ('django.db.models.fields.TextField', [], {}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255', 'primary_key': 'True'}),
            'size': ('django.db.models.fields.IntegerField', [], {})
        },
        u'application.cvdocument': {
            'Meta': {'object_name': 'CvDocument'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.gamedata': {
            'Meta': {'object_name': 'GameData'},
            'cv_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'motivation_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'})
        },
        u'application.gameinstance': {
            'Meta': {'object_name': 'GameInstance'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_cv_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_defeated_boss': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_email': ('django.db.models.fields.EmailField', [], {'max_length': '100'}),
            'player_motivation_uplockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'player_position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'player_position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'progress': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'uid': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.meeting': {
            'Meta': {'object_name': 'Meeting'},
            'dateID': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_name': ('django.db.models.fields.CharField', [], {'default': "'unknown'", 'max_length': '50'}),
            'pub_date': ('django.db.models.fields.DateField', [], {}),
            'pub_time': ('django.db.models.fields.TimeField', [], {}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.motivationletter': {
            'Meta': {'object_name': 'MotivationLetter'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'entry': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'application.playerskill': {
            'Meta': {'unique_together': "(('skill', 'game_instance'),)", 'object_name': 'PlayerSkill'},
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'skill': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.SkillSet']"})
        },
        u'application.portfoliolink': {
            'Meta': {'object_name': 'PortfolioLink'},
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'links': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'application.skillset': {
            'Meta': {'object_name': 'SkillSet'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.vacancy': {
            'Meta': {'object_name': 'Vacancy'},
            'department': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail_text': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'skill_sets': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['application.SkillSet']", 'symmetrical': 'False'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['application']